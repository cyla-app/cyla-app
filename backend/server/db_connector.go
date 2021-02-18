package server

import (
	"context"
	"log"
)

type DBConnector interface {
	DayPersistence
	StatsPersistence
	UserPersistence
	LoginPersistence
}

type DayPersistence interface {
	GetDayByUserAndRange(ctx context.Context, userId string, startDate string, endDate string) (ret []Day, err error)
	GetDaysByUserIdAndDate(ctx context.Context, userId string, date []string) (ret []Day, err error)
	ModifyDayEntry(ctx context.Context, userId string, day Day) error
	ModifyDayEntryWithStats(ctx context.Context, userId string, dayStatsUpdate DayStatsUpdate) error
}
type StatsPersistence interface {
	GetPeriodStats(ctx context.Context, userId string) (ret Statistic, err error)
	GetStats(ctx context.Context, userId string) (ret UserStats, err error)
}
type UserPersistence interface {
	CreateUser(ctx context.Context, user User) (ret UserCreatedResponse, err error)
	GetRestoreData(ctx context.Context, userId string) (ret EncryptedAttribute, err error)
	GetUserById(ctx context.Context, userId string) (ret User, err error)
	UpdateUser(ctx context.Context, userId string, user User) error
}

type LoginPersistence interface {
	LoginUser(ctx context.Context, username string) (succ *successfulAuthData, err error)
}

var DBConnection DBConnector

func InitializeDBConnection() {
	var err error
	DBConnection, err = NewRedisClient()
	if err != nil {
		log.Fatalf("Error when initializing DB client: %s", err)
	}
}
