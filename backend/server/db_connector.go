package server

import (
	"context"
)

type DBConnector interface {
	UserPersistence
}

type UserPersistence interface {
	CreateUser(ctx context.Context, user User) (userId string, err error)
	GetUserById(ctx context.Context, userId string) (User, error)
	GetRestoreDate(ctx context.Context, userId string) (keyBackup EncryptedAttribute, err error)
	UpdateUser(ctx context.Context, userId string, user User) error
	CreateDayEntry(ctx context.Context, userId string, day Day) error
	GetDaysByUserIdAndDate(ctx context.Context, userId string, dates []Date) (days []Day, err error)
	UpdateDayEntry(ctx context.Context, userId string, day Day) error
	GetDayByUserAndRange(ctx context.Context, userId string, startDate string, endDate string) (days []Day, err error)

}

var DBConnection DBConnector

func InitializeDBConnection() {
	var err error
	DBConnection, err = NewRedisClient()
	if err != nil {
		panic(err)
	}
}
