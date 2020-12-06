package server

import (
	"context"
	"errors"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
	"os"
)

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

func (s *CylaRedisClient) SaveUser(ctx context.Context, user User) (string, error) {
	userId, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	user.Id = userId.String()
	var redisUser map[string]interface{}
	_ = mapstructure.Decode(user, &redisUser)
	ret := s.HSet(ctx, fmt.Sprintf("user:%v", userId), redisUser)
	fmt.Println(ret.Err())
	return user.Id, ret.Err()
}

func (s *CylaRedisClient) GetUser(ctx context.Context, userId string) (user User, err error) {
	var ret map[string]string
	ret, err = s.HGetAll(ctx, fmt.Sprintf("user:%v", userId)).Result()
	if len(ret) == 0 {
		return User{}, errors.New("user not found")
	} else if err != nil {
		return User{}, err
	}
	err = mapstructure.Decode(ret, &user)
	return user, err
}

func (s *CylaRedisClient) GetRestoreDate(ctx context.Context, userId string) (keyBackup EncryptedAttribute, err error) {
	ret := s.HGet(ctx, fmt.Sprintf("user:%v", userId), GetUserUserKeyBackupName())
	if ret.Err() == redis.Nil {
		err = errors.New("user not found")
	}
	return EncryptedAttribute(ret.Val()), err
}
