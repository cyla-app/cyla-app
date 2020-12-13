package server

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"
	"os"

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

//TODO: Refactor duplicate code of script calls
var addDayScript = loadLuaScript("resources/create_day_script.lua")
var updateHResourceScript = loadLuaScript("resources/update_resource_script.lua")
var getDayByRange = loadLuaScript("resources/get_day_by_range.lua")

const userPrefixKey = "user"
const dayPrefixKey = "day"

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
		addDayScript.Load(context.Background(), cylaClient)
		updateHResourceScript.Load(context.Background(), cylaClient)
		getDayByRange.Load(context.Background(), cylaClient)
		return &cylaClient, nil
	}

}

func (s *CylaRedisClient) CreateUser(ctx context.Context, user User) (string, error) {
	userId, err := uuid.NewRandom()
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "could not create random", err)
	}
	user.Id = userId.String()
	var redisUser map[string]interface{}
	err = mapstructure.Decode(user, &redisUser)
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "could not unmarshall user", err)
	}

	err = s.HSet(ctx, fmt.Sprintf("%v:%v", userPrefixKey, user.Id), redisUser).Err()
	if err != nil {
		return "", newHTTPErrorWithCauseError(500, "redis error", err)
	}
	return user.Id, nil
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
	valList, err := flatStructToStringList(user)
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

func (s *CylaRedisClient) CreateDayEntry(ctx context.Context, userId string, day Day) error {
	valList, err := flatStructToStringList(day)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall day", err)
	}
	var opResult int
	opResult, err = addDayScript.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v", userPrefixKey, userId),                                //User resource
			fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),               //sorted set for user's days
			fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, day.Date)}, //days resource
		append([]interface{}{day.Date}, valList...)).Int()
	if err != nil {
		return newHTTPErrorWithCauseError(500, "redis error", err)
	}
	if opResult == 0 {
		return newHTTPError(409, "entry for date already in database or user doesn't exist")
	}
	return nil

}

func (s *CylaRedisClient) GetDaysByUserIdAndDate(ctx context.Context, userId string, dates []Date) (days []Day, err error) {
	//Pipeline to reduce communication with the redis server. This requires two for loops, as cmdStringList vals is empty
	// until the pipeline is executed
	pipeline := s.TxPipeline()
	var cmdStringList []*redis.StringStringMapCmd
	for _, date := range dates {
		cmdStringList = append(cmdStringList, pipeline.HGetAll(ctx, fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, date)))
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
		err = mapstructure.Decode(ret, &day)

		if err != nil {
			return nil, newHTTPErrorWithCauseError(500, "could not unmarshall day", err)
		}
		days = append(days, day)
	}

	return days, nil
}

func (s *CylaRedisClient) UpdateDayEntry(ctx context.Context, userId string, day Day) error {
	valList, err := flatStructToStringList(day)
	if err != nil {
		return newHTTPErrorWithCauseError(500, "could not marshall day", err)
	}
	var opResult int
	opResult, err = updateHResourceScript.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, day.Date),
		}, valList).Int()

	if opResult == 0 {
		return newHTTPError(404, "day doesn't exist")
	}

	if err != nil {
		return newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}
	return nil
}

func (s *CylaRedisClient) GetDayByUserAndRange(ctx context.Context, userId string, startDate string, endDate string) ([]Day, error) {
	if endDate == "" {
		endDate = startDate
	}
	days := make([]Day, 0)
	opResult, err := getDayByRange.Run(ctx, s,
		[]string{
			fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),
		}, []string{startDate, endDate}).Result()
	if err != nil {
		return nil, newHTTPErrorWithCauseError(500, "error during execution of pipeline", err)
	}

	var stringDaysSlice [][]string
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
