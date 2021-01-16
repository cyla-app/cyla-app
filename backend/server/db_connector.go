package server

import (
	"context"
	"log"
)

type DBConnector interface {
	DayPersistence
	LoginPersistence
	UserPersistence
}

type DayPersistence interface {
	GetDayByUserAndRange(ctx context.Context, userId string, startDate string, endDate string) (ret []Day, err error)
	GetDaysByUserIdAndDate(ctx context.Context, userId string, date []string) (ret []Day, err error)
	ModifyDayEntry(ctx context.Context, userId string, day Day) error
}
type LoginPersistence interface {
	LoginUser(ctx context.Context, username string) (ret EncryptedAttribute, err error)
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
