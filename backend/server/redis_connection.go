package server

import (
	"context"
	"errors"
	"fmt"
	"hash/fnv"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strconv"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
)

func loadLuaScript(scriptPath string) *redis.Script {
	arr, err := ioutil.ReadFile(scriptPath)
	if err != nil {
		panic(err)
	}
	return redis.NewScript(string(arr))
}

var changeDayScript = loadLuaScript("resources/change_day_script.lua")
var changeStats = loadLuaScript("resources/change_stats_script.lua")
var updateHResourceScript = loadLuaScript("resources/update_resource_script.lua")
var getDayByRange = loadLuaScript("resources/get_day_by_range.lua")
var getHashUserKeyForLogin = loadLuaScript("resources/get_hash_user_key_for_login.lua")
var shareDayScript = loadLuaScript("resources/share_day_script.lua")
var getSharesForUser = loadLuaScript("resources/get_shares_for_user_script.lua")

const userPrefixKey = "user"
const userNamePrefixKey = "name"
const dayPrefixKey = "day"
const statsPrefixKey = "stats"
const hashPrefixKey = "hashVal"
const sharedPrefixKey = "shared"

const initHashVal = "init"

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
		return &cylaClient, nil
	}

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
	jwt, err := getJWTToken(user.Id)
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

func (s *CylaRedisClient) UpdateUser(ctx context.Context, userId string, user User) error {
	if user.Id != userId && user.Id != "" {
		return newHTTPError(400, "different userId in path and in request body")
	}
	valList, err := flatStructToSlice(user)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall user", err)
	}
	var opResult int
	opResult, err = updateHResourceScript.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v", userPrefixKey, user.Id),
		}, valList).Int()

	if err != nil {
		return newHTTPError(500, "redis error")
	}
	if opResult == 0 {
		return newHTTPError(404, "user not found")
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

func (s *CylaRedisClient) ShareDays(ctx context.Context, userId string, shareInfoUpload ShareInfoUpload) (ret string, err error) {
	shareId, err := uuid.NewRandom()
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "could not create random", err)
	}
	ret = shareId.String()

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
				fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),                                           //sorted set for user's days
				fmt.Sprintf("%v:%v:%v:%v:%v", sharedPrefixKey, ret, userPrefixKey, userId, dayPrefixKey),               //sorted set for shared days
				fmt.Sprintf("%v:%v:%v:%v:%v:%v", sharedPrefixKey, ret, userPrefixKey, userId, dayPrefixKey, day.Date)}, //days resource
			append([]interface{}{day.Date}, valList...))
	}

	share := Share{
		Owner:           userId,
		ExpirationDate:  "testExpDate", //TODO: Use proper exp date
		SharedKeyBackup: shareInfoUpload.SharedKeyBackup,
		ShareId:         ret,
	}
	var redisShare map[string]interface{}
	err = mapstructure.Decode(share, &redisShare)
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "could not unmarshall share", err)
	}
	pipeline.HSet(ctx, fmt.Sprintf("%v:%v", sharedPrefixKey, ret), redisShare)

	pipeline.SAdd(ctx,
		fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, sharedPrefixKey),
		ret)

	_, err = pipeline.Exec(ctx)
	if err != nil {
		// TODO: Clean database of incomplete share entries. Maybe use expiration dates for that?
		return "", newHTTPErrorWithCauseError(400, "One or more days to be shared don't exist", err)
	}

	return ret, nil
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
			statPrefix}, // TODO: Use constant stats prefix keys instead of statName
			append([]interface{}{stat.PrevHashValue, stringHashValue}, valListStats...))

	}
	return nil
}

func (s *CylaRedisClient) GetDaysByUserIdAndDate(ctx context.Context, userId string, dates []DayDate) (days []Day, err error) {
	return s.getDaysByDate(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId),dates)
}

func (s *CylaRedisClient) ShareGetDaysByUserIdAndDate(
	ctx context.Context, shareId string, userId string, dates []string) (ret []Day, err error) {
	return s.getDaysByDate(ctx, fmt.Sprintf("%v:%v:%v:%v", sharedPrefixKey, shareId, userPrefixKey, userId), dates)
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
	ctx context.Context, shareId string, userId string, startDate string, endDate string) (ret []Day, err error) {
	return s.getDayByRange(ctx,
		fmt.Sprintf("%v:%v:%v:%v:%v", sharedPrefixKey, shareId, userPrefixKey, userId, dayPrefixKey), startDate, endDate)
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

func (s *CylaRedisClient) GetStats(ctx context.Context, userId string) (userStats UserStats, err error) {
	pipeline := s.TxPipeline()
	userStatsMap, _ := userStatsToMap(userStats)
	cmdMap := make(map[string]*redis.StringStringMapCmd)
	for statName := range userStatsMap {
		cmdMap[statName] = pipeline.HGetAll(ctx,
			fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, statsPrefixKey, statName))
	}
	_, err = pipeline.Exec(ctx)
	if err != nil {
		return userStats, newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}
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

func (s *CylaRedisClient) GetPeriodStats(ctx context.Context, userId string) (ret Statistic, err error) {
	return s.getSingleStat(ctx, userId, GetUserStatsPeriodStatsName())
}

func (s *CylaRedisClient) getSingleStat(ctx context.Context, userId string, statName string) (ret Statistic, err error) {
	redisRet := s.HGetAll(ctx,
		fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, statsPrefixKey, statName))

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
