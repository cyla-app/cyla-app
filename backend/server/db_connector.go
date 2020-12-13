package server

import (
	"context"
	"log"
)

type DBConnector interface {
	DayPersistence
	UserPersistence
}

type DayPersistence interface {
	CreateDayEntry(ctx context.Context, userId string, day Day) error
	GetDayByUserAndRange(ctx context.Context, userId string, startDate string, endDate string) (ret []Day, err error)
	GetDaysByUserIdAndDate(ctx context.Context, userId string, date []string) (ret []Day, err error)
	UpdateDayEntry(ctx context.Context, userId string, day Day) error
}
type UserPersistence interface {
	CreateUser(ctx context.Context, user User) (ret string, err error)
	GetRestoreData(ctx context.Context, userId string) (ret EncryptedAttribute, err error)
	GetUserById(ctx context.Context, userId string) (ret User, err error)
	UpdateUser(ctx context.Context, userId string, user User) error
}

var DBConnection DBConnector

func InitializeDBConnection() {
	var err error
	DBConnection, err = NewRedisClient()
	if err != nil {
		log.Fatalf("Error when initializing DB client: %s", err)
	}
}
