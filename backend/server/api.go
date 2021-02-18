/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

import (
	"context"
	"net/http"

	"github.com/gorilla/websocket"
)

// DayApiRouter defines the required methods for binding the api requests to a responses for the DayApi
// The DayApiRouter implementation should parse necessary information from the http request,
// pass the data to a DayApiServicer to perform the required actions, then write the service results to the http response.
type DayApiRouter interface {
	GetDayByUserAndRange(http.ResponseWriter, *http.Request)
	GetDaysByUserIdAndDate(http.ResponseWriter, *http.Request)
	ModifyDayEntry(http.ResponseWriter, *http.Request)
	ModifyDayEntryWithStats(http.ResponseWriter, *http.Request)
}

// StatsApiRouter defines the required methods for binding the api requests to a responses for the StatsApi
// The StatsApiRouter implementation should parse necessary information from the http request,
// pass the data to a StatsApiServicer to perform the required actions, then write the service results to the http response.
type StatsApiRouter interface {
	GetPeriodStats(http.ResponseWriter, *http.Request)
	GetStats(http.ResponseWriter, *http.Request)
}

// UserApiRouter defines the required methods for binding the api requests to a responses for the UserApi
// The UserApiRouter implementation should parse necessary information from the http request,
// pass the data to a UserApiServicer to perform the required actions, then write the service results to the http response.
type UserApiRouter interface {
	CreateUser(http.ResponseWriter, *http.Request)
	GetRestoreData(http.ResponseWriter, *http.Request)
	GetUserById(http.ResponseWriter, *http.Request)
	UpdateUser(http.ResponseWriter, *http.Request)
}

type LoginApiRouter interface {
	LoginUser(http.ResponseWriter, *http.Request)
}

// DayApiServicer defines the api actions for the DayApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type DayApiServicer interface {
	GetDayByUserAndRange(context.Context, string, string, string) (ImplResponse, error)
	GetDaysByUserIdAndDate(context.Context, string, []string) (ImplResponse, error)
	ModifyDayEntry(context.Context, string, Day) (ImplResponse, error)
	ModifyDayEntryWithStats(context.Context, string, DayStatsUpdate) (ImplResponse, error)
}

// StatsApiServicer defines the api actions for the StatsApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type StatsApiServicer interface {
	GetPeriodStats(context.Context, string) (ImplResponse, error)
	GetStats(context.Context, string) (ImplResponse, error)
}

// UserApiServicer defines the api actions for the UserApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type UserApiServicer interface {
	CreateUser(context.Context, User) (ImplResponse, error)
	GetRestoreData(context.Context, string) (ImplResponse, error)
	GetUserById(context.Context, string) (ImplResponse, error)
	UpdateUser(context.Context, string, User) (ImplResponse, error)
}

type LoginApiServicer interface {
	LoginUser(context.Context, string, *websocket.Conn) (ImplResponse, error)
}
