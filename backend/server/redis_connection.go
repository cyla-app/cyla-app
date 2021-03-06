package server

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"hash/fnv"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/robfig/cron/v3"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
	"golang.org/x/crypto/bcrypt"
)

func loadLuaScript(scriptPath string) *redis.Script {
	arr, err := ioutil.ReadFile(scriptPath)
	if err != nil {
		panic(err)
	}
	return redis.NewScript(string(arr))
}

var changeDayScript = loadLuaScript("resources/lua-scripts/change_day_script.lua")
var changeStats = loadLuaScript("resources/lua-scripts/change_stats_script.lua")
var updateHResourceScript = loadLuaScript("resources/lua-scripts/update_resource_script.lua")
var getDayByRange = loadLuaScript("resources/lua-scripts/get_day_by_range.lua")
var getHashUserKeyForLogin = loadLuaScript("resources/lua-scripts/get_hash_user_key_for_login.lua")
var shareDayScript = loadLuaScript("resources/lua-scripts/share_day_script.lua")
var getSharesForUser = loadLuaScript("resources/lua-scripts/get_shares_for_user_script.lua")
var changePassphrase = loadLuaScript("resources/lua-scripts/change_passphrase_script.lua")

const userPrefixKey = "user"
const userNamePrefixKey = "name"
const dayPrefixKey = "day"
const statsPrefixKey = "stats"
const hashPrefixKey = "hashVal"
const sharedPrefixKey = "shared"
const deleteAtPrefixKey = "deleteAt"

const initHashVal = "init"

const dateFormat = "2006-01-02" // Counterintuitively, the Format in Go has to be the exact date of 2006-01-02

type CylaRedisClient struct {
	*redis.Client
}

func NewRedisClient() (*CylaRedisClient, error) {
	redisPassword, ok := os.LookupEnv("REDIS_PASSWORD")
	if !ok {
		return nil, errors.New("redis password not set")
	} else {
		cylaClient := CylaRedisClient{redis.NewClient(&redis.Options{
			Addr:     "redis:6379",
			Password: redisPassword,
			DB:       0,
		})}
		changeDayScript.Load(context.Background(), cylaClient)
		changeStats.Load(context.Background(), cylaClient)
		updateHResourceScript.Load(context.Background(), cylaClient)
		getDayByRange.Load(context.Background(), cylaClient)
		getHashUserKeyForLogin.Load(context.Background(), cylaClient)
		shareDayScript.Load(context.Background(), cylaClient)
		getSharesForUser.Load(context.Background(), cylaClient)
		changePassphrase.Load(context.Background(), cylaClient)

		scheduleCleanUpJob(&cylaClient)
		return &cylaClient, nil
	}

}

func scheduleCleanUpJob(client *CylaRedisClient) {
	ctx, _ := context.WithCancel(context.Background())
	c := cron.New()
	c.AddFunc("@midnight", func() {
		client.deleteExpiredShares(ctx)
	})
	log.Println("Starting cron scheduler")
	c.Start()
}

func (s *CylaRedisClient) LoginUser(ctx context.Context, username string) (*successfulAuthData, error) {
	ret, err := getHashUserKeyForLogin.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v:%v", userPrefixKey, userNamePrefixKey, username),
			userPrefixKey},
		GetUserUserKeyBackupName(), GetUserAuthKeyName()).Result()
	if err != nil {
		return &successfulAuthData{}, newHTTPErrorWithCauseError(500, "could not retrieve hash for user key", err)
	}
	var retSlice []string
	err = mapstructure.Decode(ret, &retSlice)
	if err != nil {
		return &successfulAuthData{}, newHTTPErrorWithCauseError(500, "Error when decoding redis return", err)
	}
	if len(retSlice) < 3 {
		return &successfulAuthData{}, newHTTPError(500, "Redis return had an unexpected length")
	}
	return &successfulAuthData{
		UUID:    retSlice[0],
		UserKey: retSlice[1],
		authKey: retSlice[2],
	}, nil
}

func (s *CylaRedisClient) CreateUser(ctx context.Context, user User) (response UserCreatedResponse, err error) {
	matches, _ := regexp.MatchString(`^[a-zA-Z0-9._-]{4,20}$`, user.Username)
	if !matches {
		return response, newHTTPError(409, `User name does not follow the requirements: between 4 and 20 characters and only using alphanumeric symbols or '.', '_', '-'. `)
	}

	userId, err := uuid.NewRandom()
	if err != nil {
		return response, newHTTPErrorWithCauseError(500, "could not create random", err)
	}
	user.Id = userId.String()
	var redisUser map[string]interface{}
	err = mapstructure.Decode(user, &redisUser)
	if err != nil {
		return response, newHTTPErrorWithCauseError(500, "could not unmarshall user", err)
	}

	if !s.SetNX(ctx, fmt.Sprintf("%v:%v:%v", userPrefixKey, userNamePrefixKey, user.Username), user.Id, 0).Val() {
		return response, newHTTPError(409, "User name already in use.")
	}

	_, err = s.HSet(ctx, fmt.Sprintf("%v:%v", userPrefixKey, user.Id), redisUser).Result()
	if err != nil {
		return response, newHTTPErrorWithCauseError(500, "redis error", err)
	}
	jwt, err := getUserJWTToken(user.Id)
	if err != nil {
		return response, newHTTPErrorWithCauseError(500, "error creating jwt", err)
	}
	response.Jwt = jwt
	response.UserId = user.Id
	return response, nil
}

func (s *CylaRedisClient) GetUserById(ctx context.Context, userId string) (user User, err error) {
	var ret map[string]string
	ret, err = s.HGetAll(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId)).Result()
	if len(ret) == 0 {
		return User{}, newHTTPError(404, "user not found")
	} else if err != nil {
		return User{}, newHTTPErrorWithCauseError(500, "redis error", err)
	}

	err = mapstructure.Decode(ret, &user)
	if err != nil {
		return user, newHTTPErrorWithCauseError(500, "could not unmarshall user", err)
	}
	return user, nil
}

func (s *CylaRedisClient) GetRestoreData(ctx context.Context, userId string) (keyBackup EncryptedAttribute, err error) {
	ret := s.HGet(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId), GetUserUserKeyBackupName())
	if ret.Err() == redis.Nil {
		err = newHTTPError(404, "user not found")
	}
	return ret.Val(), err
}

func (s *CylaRedisClient) ChangePassPassphrase(ctx context.Context, userId string, changePassphraseDto ChangePassphraseDto) error {
	err := changePassphrase.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v", userPrefixKey, userId),
			fmt.Sprintf(changePassphraseDto.OldAuthKey),
		},
		[]interface{}{GetUserAuthKeyName(),
			GetUserAuthKeyName(), changePassphraseDto.NewAuthKey,
			GetUserUserKeyBackupName(), changePassphraseDto.NewEncryptedUserKey}).Err()
	if err != nil {
		return newHTTPError(400, "Passphrase or userid incorrect")
	}
	return nil
}

func (s *CylaRedisClient) ModifyDayEntry(ctx context.Context, userId string, day Day) error {
	//TODO: Remove duplicate code for modifyDayEntry and modifyDayEntryWithStats
	valList, err := flatStructToSlice(day)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall day", err)
	}
	var opResult int
	opResult, err = changeDayScript.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v", userPrefixKey, userId),                                //User resource
			fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),               //sorted set for user's days
			fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, day.Date)}, //days resource
		append([]interface{}{day.Date}, valList...)).Int()
	if err != nil {
		return newHTTPErrorWithCauseError(500, "redis error", err)
	}
	if opResult == 0 {
		return newHTTPError(404, "user doesn't exist")
	}
	return nil

}

func (s *CylaRedisClient) deleteExpiredShares(ctx context.Context) {
	today := time.Now().Format(dateFormat)
	log.Printf("Deleting expired entries for %v", today)
	// Normal pipeline instead of TxPipeline to avoid blocking redis for long
	pipeline := s.Pipeline()
	for _, toDeleteEntry := range s.SMembers(ctx, fmt.Sprintf("%v:%v", deleteAtPrefixKey, today)).Val() {
		toDeleteEntrySlice := strings.Split(toDeleteEntry, "#")
		if len(toDeleteEntrySlice) != 2 {
			log.Printf("Error: to delete entries should have two parts separated by #. %v", toDeleteEntrySlice)
		} else {
			pipeline.SRem(ctx, toDeleteEntrySlice[0], toDeleteEntrySlice[1])
		}
	}
	_, _ = pipeline.Exec(ctx)
}

func (s *CylaRedisClient) ShareDays(ctx context.Context, userId string, shareInfoUpload ShareInfoUpload) (shareIdString string, err error) {

	// tempExpirationDate is used to automatically remove all share entries in redis in case something goes wrong, i.e. a shared day doesn't exist
	tempDur, _ := time.ParseDuration("2m")
	tempExpirationDate := time.Now().Add(tempDur)

	dur, _ := time.ParseDuration("720h") // Expire after 30 days
	expirationDate := time.Now().Add(dur)

	keysSlice := make([]string, 0, 4)
	addKeyToSlice := func(key string) string {
		keysSlice = append(keysSlice, key)
		return key
	}
	shareId, err := uuid.NewRandom()
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "could not create random", err)
	}
	shareIdString = shareId.String()

	if s.Exists(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId)).Val() == 0 {
		return "", newHTTPError(404, "user doesn't exist")
	}

	pipeline := s.TxPipeline()
	for _, day := range shareInfoUpload.Days {
		valList, err := flatStructToSlice(day)
		if err != nil {
			return "", newHTTPErrorWithCauseError(500, "could not marshall day", err)
		}

		shareDayScript.Run(ctx, pipeline,
			[]string{
				fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),                                       //sorted set for user's days DO NOT SET EXP DATE HERE
				addKeyToSlice(fmt.Sprintf("%v:%v:%v", sharedPrefixKey, shareIdString, dayPrefixKey)),               //sorted set for shared days
				addKeyToSlice(fmt.Sprintf("%v:%v:%v:%v", sharedPrefixKey, shareIdString, dayPrefixKey, day.Date))}, //days resource
			append([]interface{}{tempExpirationDate.Unix(), day.Date}, valList...))
	}
	if err = saveStatsShare(ctx, pipeline, shareInfoUpload.Statistics, shareIdString, tempExpirationDate, addKeyToSlice); err != nil {
		return "", err
	}
	pwdDecoded, err := base64.StdEncoding.DecodeString(shareInfoUpload.AuthKey)
	if err != nil {
		log.Println("Error while decoding hashKey")
		return "", newHTTPErrorWithCauseError(500, "error when decoding passphrase", err)
	}
	hashPwd, _ := bcrypt.GenerateFromPassword(pwdDecoded, bcrypt.MinCost)
	share := Share{
		Owner:           userId,
		ExpirationDate:  expirationDate.Format(dateFormat),
		SharedKeyBackup: shareInfoUpload.SharedKeyBackup,
		ShareId:         shareIdString,
		AuthKey:         string(hashPwd),
	}
	var redisShare map[string]interface{}
	err = mapstructure.Decode(share, &redisShare)
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "could not unmarshall share", err)
	}
	keyShare := addKeyToSlice(fmt.Sprintf("%v:%v", sharedPrefixKey, shareIdString))
	pipeline.HSet(ctx, keyShare, redisShare)
	pipeline.ExpireAt(ctx, fmt.Sprintf("%v:%v", sharedPrefixKey, shareIdString), tempExpirationDate)

	pipeline.SAdd(ctx,
		fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, sharedPrefixKey),
		shareIdString)

	//Add the shareId entry in the user set to be deleted one day (to avoid inconsistency issues) after  the other keys are deleted.
	// It is then the responsibility of a the server to delete the entry at that date (for example, through a cron job).
	pipeline.SAdd(ctx,
		fmt.Sprintf("%v:%v", deleteAtPrefixKey, expirationDate.AddDate(0, 0, 1).Format(dateFormat)),
		fmt.Sprintf("%v:%v:%v#%v", userPrefixKey, userId, sharedPrefixKey, shareIdString))

	_, err = pipeline.Exec(ctx)
	if err != nil {
		return "", newHTTPErrorWithCauseError(400, "One or more days to be shared don't exist", err)
	}
	// If everything went well, set the expiration date to 30 days.
	s.setExpirationDate(ctx, expirationDate, keysSlice)
	return shareIdString, nil
}

func (s *CylaRedisClient) setExpirationDate(ctx context.Context, expirationDate time.Time, keysSlice []string) {
	var err error
	for _, key := range keysSlice {
		log.Printf("Setting expiration date for %s", key)
		err = s.ExpireAt(ctx, key, expirationDate).Err()
		if err != nil {
			log.Println("Unexpected error when setting TTL. This should not happen.")
		}
	}
}

func (s *CylaRedisClient) ModifyDayEntryWithStats(ctx context.Context, userId string, dayStatsUpdate DayStatsUpdate) error {
	valListDay, err := flatStructToSlice(dayStatsUpdate.Day)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall day", err)
	}

	pipeline := s.TxPipeline()

	scriptCmd := changeDayScript.Run(ctx, pipeline, []string{
		fmt.Sprintf("%v:%v", userPrefixKey, userId),                                               //User resource
		fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),                              //sorted set for user's days
		fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, dayStatsUpdate.Day.Date)}, //days resource
		append([]interface{}{dayStatsUpdate.Day.Date}, valListDay...))

	if err = saveStats(ctx, pipeline, dayStatsUpdate.UserStats, userId); err != nil {
		return err
	}

	_, err = pipeline.Exec(ctx)

	if err != nil {
		log.Println("Error during pipeline", err)
		return newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}
	if scriptRet, _ := scriptCmd.Int(); scriptRet == 0 {
		return newHTTPError(404, "user doesn't exist")
	}
	return nil
}

func saveStats(ctx context.Context, pipeline redis.Pipeliner, userStats UserStats, userId string) error {

	userStatsMap, err := userStatsToMap(userStats)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall user stats", err)
	}
	for statName, stat := range userStatsMap {
		if stat.PrevHashValue == "" {
			stat.PrevHashValue = initHashVal
		}
		h := fnv.New32()
		h.Write([]byte(stat.Value))
		stringHashValue := strconv.Itoa(int(h.Sum32()))
		stat.HashValue = stringHashValue
		valListStats, err := flatStructToSlice(stat)
		if err != nil {
			return newHTTPErrorWithCauseError(500, "could not marshall stat", err)
		}

		statPrefix := fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, statsPrefixKey, statName)
		changeStats.Run(ctx, pipeline, []string{
			fmt.Sprintf("%v:%v", userPrefixKey, userId), //User resource
			statPrefix + fmt.Sprintf(":%v", hashPrefixKey),
			statPrefix},
			append([]interface{}{stat.PrevHashValue, stringHashValue}, valListStats...))

	}
	return nil
}

func saveStatsShare(ctx context.Context, pipeline redis.Pipeliner, userStats UserStats, shareId string,
	tempExpDate time.Time,
	addKeyFunc func(string) string) error {
	userStatsMap, err := userStatsToMap(userStats)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall user stats", err)
	}

	for statName, stat := range userStatsMap {
		valListStats, err := flatStructToSlice(stat)
		if err != nil {
			return newHTTPErrorWithCauseError(500, "could not marshall stat", err)
		}
		key := addKeyFunc(fmt.Sprintf("%v:%v:%v:%v",
			sharedPrefixKey, shareId, statsPrefixKey, statName))
		pipeline.HSet(ctx, key, valListStats...)
		pipeline.ExpireAt(ctx, key, tempExpDate)
	}
	return nil
}

func (s *CylaRedisClient) GetDaysByUserIdAndDate(ctx context.Context, userId string, dates []DayDate) (days []Day, err error) {
	return s.getDaysByDate(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId), dates)
}

func (s *CylaRedisClient) ShareGetDaysByUserIdAndDate(
	ctx context.Context, shareId string, dates []string) (ret []Day, err error) {
	return s.getDaysByDate(ctx, fmt.Sprintf("%v:%v", sharedPrefixKey, shareId), dates)
}

func (s *CylaRedisClient) getDaysByDate(ctx context.Context, keyPrefix string, dates []DayDate) (days []Day, err error) {
	//Pipeline to reduce communication with the redis server. This requires two for loops, as cmdStringList vals is empty
	// until the pipeline is executed
	pipeline := s.TxPipeline()
	var cmdStringList []*redis.StringStringMapCmd
	for _, date := range dates {
		cmdStringList = append(cmdStringList, pipeline.HGetAll(ctx, fmt.Sprintf("%v:%v:%v", keyPrefix, dayPrefixKey, date)))
	}
	_, err = pipeline.Exec(ctx)
	if err != nil {
		return nil, newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}
	for i, cmd := range cmdStringList {
		ret := cmd.Val()
		if len(ret) == 0 {
			return nil, newHTTPError(404, fmt.Sprintf("could not find day with date %v", dates[i]))
		}
		day := Day{}
		err = mapstructure.WeakDecode(ret, &day)

		if err != nil {
			return nil, newHTTPErrorWithCauseError(500, "could not unmarshall day", err)
		}
		days = append(days, day)
	}

	return days, nil
}

func (s *CylaRedisClient) GetDayByUserAndRange(ctx context.Context, userId string, startDate DayDate, endDate DayDate) ([]Day, error) {
	return s.getDayByRange(ctx, fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey), startDate, endDate)
}

func (s *CylaRedisClient) ShareGetDayByUserAndRange(
	ctx context.Context, shareId string, startDate string, endDate string) (ret []Day, err error) {
	return s.getDayByRange(ctx,
		fmt.Sprintf("%v:%v:%v", sharedPrefixKey, shareId, dayPrefixKey), startDate, endDate)
}

func (s *CylaRedisClient) getDayByRange(ctx context.Context, daySetKey string, startDate string, endDate string) (ret []Day, err error) {
	if endDate == "" {
		endDate = startDate
	}
	days := make([]Day, 0)
	opResult, err := getDayByRange.Run(ctx, s,
		[]string{
			daySetKey,
		}, []string{startDate, endDate}).Result()
	if err != nil {
		return nil, newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}

	var stringDaysSlice [][]interface{}

	err = mapstructure.Decode(opResult, &stringDaysSlice)
	if err != nil {
		return nil, newHTTPErrorWithCauseError(500, "could not marshall results", err)
	}
	for _, entry := range stringDaysSlice {
		var day Day
		err = stringSliceToFlatStruct(entry, &day)
		if err != nil {
			return nil, newHTTPErrorWithCauseError(500, "could not marshall day", err)
		}
		days = append(days, day)
	}
	return days, nil
}

func (s *CylaRedisClient) getStats(ctx context.Context, keyPrefix string) (userStats UserStats, err error) {
	pipeline := s.TxPipeline()

	var mapTmp = map[string]interface{}{}
	_ = mapstructure.Decode(userStats, &mapTmp)
	cmdMap := make(map[string]*redis.StringStringMapCmd)
	for statName := range mapTmp {
		cmdMap[statName] = pipeline.HGetAll(ctx,
			fmt.Sprintf("%v:%v:%v", keyPrefix, statsPrefixKey, statName))
	}
	_, err = pipeline.Exec(ctx)
	if err != nil {
		return userStats, newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}

	userStatsMap := make(map[string]Statistic)
	for statName, cmd := range cmdMap {
		ret := cmd.Val()
		if len(ret) == 0 {
			return userStats, newHTTPError(404, fmt.Sprintf("could not find stat with name %v", statName))
		}
		var stat Statistic
		err = mapstructure.WeakDecode(ret, &stat)
		if err != nil {
			return userStats, newHTTPErrorWithCauseError(500,
				fmt.Sprintf("could not unmarshall stat with name %v", statName),
				err)
		}
		if stat.PrevHashValue == initHashVal {
			stat.PrevHashValue = ""
		}
		userStatsMap[statName] = stat
	}
	err = mapstructure.Decode(userStatsMap, &userStats)
	if err != nil {
		return userStats, newHTTPError(500, "error when marshalling user Stats")
	}
	return
}

func (s *CylaRedisClient) GetStats(ctx context.Context, userId string) (userStats UserStats, err error) {
	return s.getStats(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId))
}

func (s *CylaRedisClient) ShareGetStats(ctx context.Context, shareId string) (ret UserStats, err error) {
	return s.getStats(ctx, fmt.Sprintf("%v:%v", sharedPrefixKey, shareId))
}

func (s *CylaRedisClient) GetPeriodStats(ctx context.Context, userId string) (ret Statistic, err error) {
	return s.getSingleStat(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId),
		GetUserStatsPeriodStatsName())
}

func (s *CylaRedisClient) ShareGetPeriodStats(ctx context.Context, shareId string) (ret Statistic, err error) {
	return s.getSingleStat(ctx,
		fmt.Sprintf("%v:%v", sharedPrefixKey, shareId),
		GetUserStatsPeriodStatsName())
}

func (s *CylaRedisClient) getSingleStat(ctx context.Context, keyPrefix string, statName string) (ret Statistic, err error) {
	redisRet := s.HGetAll(ctx,
		fmt.Sprintf("%v:%v:%v", keyPrefix, statsPrefixKey, statName))

	if redisRet.Err() != nil {
		return ret, newHTTPErrorWithCauseError(500,
			fmt.Sprintf("redis error when retrieving %v", statName), err)
	}

	redisMap := redisRet.Val()

	if len(redisMap) == 0 {
		return ret, newHTTPError(404, fmt.Sprintf("could not find stat with name %v", statName))
	}

	err = mapstructure.WeakDecode(redisMap, &ret)
	if err != nil {
		return ret, newHTTPErrorWithCauseError(500, fmt.Sprintf("error when unmarshalling %v", statName), err)
	}
	return ret, nil
}

func (s *CylaRedisClient) GetShares(ctx context.Context, userId string) (ret []Share, err error) {
	opResult, err := getSharesForUser.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, sharedPrefixKey),
			sharedPrefixKey,
		}).Result()
	if err != nil {
		return nil, newHTTPErrorWithCauseError(500, "error while runing script", err)
	}

	var stringSharesSlice [][]interface{}

	err = mapstructure.Decode(opResult, &stringSharesSlice)
	if err != nil {
		return nil, newHTTPErrorWithCauseError(500, "could not marshall results", err)
	}
	for _, entry := range stringSharesSlice {
		var share Share
		err = stringSliceToFlatStruct(entry, &share)
		if err != nil {
			return nil, newHTTPErrorWithCauseError(500, "could not marshall day", err)
		}
		ret = append(ret, share)
	}
	return
}

func (s *CylaRedisClient) ShareAuth(ctx context.Context, shareId string, sharedPwdDto SharedPwdDto) (ret SuccessfulShareAuthData, err error) {
	pipeline := s.TxPipeline()
	hashedPwdCmd := pipeline.HGet(ctx, fmt.Sprintf("%v:%v", sharedPrefixKey, shareId), GetShareAuthKeyName())
	shareKeyCmd := pipeline.HGet(ctx, fmt.Sprintf("%v:%v", sharedPrefixKey, shareId), GetShareSharedKeyBackupName())

	_, err = pipeline.Exec(ctx)
	if err != nil {
		return ret, newHTTPErrorWithCauseError(400, "error when executing redis pipeline", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPwdCmd.Val()), []byte(sharedPwdDto.HashedPwd))
	if err != nil {
		return ret, newHTTPErrorWithCauseError(500, "error when authenticating", err)
	}
	jwt, err := getShareJWTToken(shareId)
	if err != nil {
		return ret, newHTTPErrorWithCauseError(500, "error when authenticating", err)
	}
	ret.Jwt = jwt
	ret.ShareKey = shareKeyCmd.Val()
	return
}
