package server

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
)

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
		return &CylaRedisClient{redis.NewClient(&redis.Options{
			Addr:     "redis:6379",
			Password: redisPassword,
			DB:       0,
		})}, nil
	}

}

func (s *CylaRedisClient) CreateUser(ctx context.Context, user User) (string, error) {
	// TODO: Error if user exists already
	userId, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	user.Id = userId.String()
	return user.Id, s.saveUserIntern(ctx, user)
}

func (s *CylaRedisClient) GetUser(ctx context.Context, userId string) (user User, err error) {
	var ret map[string]string
	ret, err = s.HGetAll(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId)).Result()
	if len(ret) == 0 {
		return User{}, errors.New("user not found")
	} else if err != nil {
		return User{}, err
	}
	err = mapstructure.Decode(ret, &user)
	return user, err
}

func (s *CylaRedisClient) GetRestoreDate(ctx context.Context, userId string) (keyBackup EncryptedAttribute, err error) {
	ret := s.HGet(ctx, fmt.Sprintf("%v:%v", userPrefixKey, userId), GetUserUserKeyBackupName())
	if ret.Err() == redis.Nil {
		err = errors.New("user not found")
	}
	return ret.Val(), err
}

func (s *CylaRedisClient) UpdateUser(ctx context.Context, userId string, user User) error {
	// TODO: Error if user doesn't exist
	if user.Id != userId && user.Id != "" {
		return errors.New("different userId in path and in request body")
	}
	return s.saveUserIntern(ctx, user)
}

func (s *CylaRedisClient) saveUserIntern(ctx context.Context, user User) error {
	var redisUser map[string]interface{}
	_ = mapstructure.Decode(user, &redisUser)
	return s.HSet(ctx, fmt.Sprintf("%v:%v", userPrefixKey, user.Id), redisUser).Err()
}

func (s *CylaRedisClient) CreateDayEntry(ctx context.Context, userId string, day Day) error {
	var redisDay map[string]interface{}
	_ = mapstructure.Decode(day, &redisDay)

	//TODO: Consistency if user does not exist
	pipeline := s.TxPipeline()
	numAddedCmd := pipeline.ZAddNX(ctx, fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey), &redis.Z{Score: 0, Member: day.Date})
	pipeline.HSet(ctx,
		fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, day.Date),
		redisDay)
	_, err := pipeline.Exec(ctx)
	if err != nil {
		return err
	}
	if numAddedCmd.Val() == 0 {
		return errors.New("entry for date already in database")
	}
	if numAddedCmd.Val() == 0 {
		return err
	}
	return nil

}

func (s *CylaRedisClient) GetDaysByUserIdAndDate(ctx context.Context, userId string, dates []Date) (days []Day, err error) {
	for _, date := range dates {
		// TODO Add transaction pipeline
		var ret map[string]string
		ret, err = s.HGetAll(ctx, fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, date)).Result()
		if len(ret) == 0 {
			return nil, errors.New("day not found")
		} else if err != nil {
			return nil, err
		}

		day := Day{}
		err = mapstructure.Decode(ret, &day)

		if err != nil {
			return nil, err
		}
		days = append(days, day)
	}

	return days, nil
}

func (s *CylaRedisClient) UpdateDayEntry(ctx context.Context, userId string, day Day) error {
	//TODO: Error if date does not exist
	return s.CreateDayEntry(ctx, userId, day)
}

func (s *CylaRedisClient) GetDayByUserAndRange(ctx context.Context, userId string, startDate string, endDate string) (days []Day, err error) {
	//Get existing days
	fmt.Println(s.ZRange(ctx, fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey), 0, -1))
	fmt.Println(s.ZScore(ctx, fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey), "2020-12-08"))
	dateEntries, err := s.ZRangeByLex(ctx, fmt.Sprintf("%v:%v:%v", userPrefixKey, userId, dayPrefixKey),
		&redis.ZRangeBy{Min: "[" + startDate,  Max: "[" + endDate}).Result()
	if err != nil {
		return nil, err
	}
	for _, date := range dateEntries {
		//TODO pipeline gets
		var ret map[string]string
		ret, err := s.HGetAll(ctx, fmt.Sprintf("%v:%v:%v:%v", userPrefixKey, userId, dayPrefixKey, date)).Result()
		if err != nil {
			return nil, err
		}
		day := Day{}
		err = mapstructure.Decode(ret, &day)

		if err != nil {
			return nil, err
		}
		days = append(days, day)
	}

	return days, nil

}
