package server

import (
	"context"
)

type DBConnector interface {
	UserPersistence
}

type UserPersistence interface {
	SaveUser(ctx context.Context, user User) (userId string, err error)
	GetUser(ctx context.Context, userId string) (User, error)
}

var DBConnection DBConnector

func InitializeDBConnection() {
	var err error
	DBConnection, err = NewRedisClient()
	if err != nil {
		panic(err)
	}
}
