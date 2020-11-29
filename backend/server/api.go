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
)

// ActivityApiRouter defines the required methods for binding the api requests to a responses for the ActivityApi
// The ActivityApiRouter implementation should parse necessary information from the http request,
// pass the data to a ActivityApiServicer to perform the required actions, then write the service results to the http response.
type ActivityApiRouter interface {
	GetSexActivityByDate(http.ResponseWriter, *http.Request)
}

// BleedingApiRouter defines the required methods for binding the api requests to a responses for the BleedingApi
// The BleedingApiRouter implementation should parse necessary information from the http request,
// pass the data to a BleedingApiServicer to perform the required actions, then write the service results to the http response.
type BleedingApiRouter interface {
	GetBleedingByDate(http.ResponseWriter, *http.Request)
}

// CervicalApiRouter defines the required methods for binding the api requests to a responses for the CervicalApi
// The CervicalApiRouter implementation should parse necessary information from the http request,
// pass the data to a CervicalApiServicer to perform the required actions, then write the service results to the http response.
type CervicalApiRouter interface {
	GetCervicalByDate(http.ResponseWriter, *http.Request)
}

// CervixApiRouter defines the required methods for binding the api requests to a responses for the CervixApi
// The CervixApiRouter implementation should parse necessary information from the http request,
// pass the data to a CervixApiServicer to perform the required actions, then write the service results to the http response.
type CervixApiRouter interface {
	GetCervixByDate(http.ResponseWriter, *http.Request)
}

// DayApiRouter defines the required methods for binding the api requests to a responses for the DayApi
// The DayApiRouter implementation should parse necessary information from the http request,
// pass the data to a DayApiServicer to perform the required actions, then write the service results to the http response.
type DayApiRouter interface {
	CreateDayEntry(http.ResponseWriter, *http.Request)
	GetDayByUserAndRange(http.ResponseWriter, *http.Request)
	GetDaysByUserIdAndDate(http.ResponseWriter, *http.Request)
	UpdateDayEntry(http.ResponseWriter, *http.Request)
}

// DesireApiRouter defines the required methods for binding the api requests to a responses for the DesireApi
// The DesireApiRouter implementation should parse necessary information from the http request,
// pass the data to a DesireApiServicer to perform the required actions, then write the service results to the http response.
type DesireApiRouter interface {
	GetSexDesireByDate(http.ResponseWriter, *http.Request)
}

// MoodApiRouter defines the required methods for binding the api requests to a responses for the MoodApi
// The MoodApiRouter implementation should parse necessary information from the http request,
// pass the data to a MoodApiServicer to perform the required actions, then write the service results to the http response.
type MoodApiRouter interface {
	GetMoodByDate(http.ResponseWriter, *http.Request)
}

// PainApiRouter defines the required methods for binding the api requests to a responses for the PainApi
// The PainApiRouter implementation should parse necessary information from the http request,
// pass the data to a PainApiServicer to perform the required actions, then write the service results to the http response.
type PainApiRouter interface {
	GetPainByDate(http.ResponseWriter, *http.Request)
}

// TemperatureApiRouter defines the required methods for binding the api requests to a responses for the TemperatureApi
// The TemperatureApiRouter implementation should parse necessary information from the http request,
// pass the data to a TemperatureApiServicer to perform the required actions, then write the service results to the http response.
type TemperatureApiRouter interface {
	GetTemperatureByDate(http.ResponseWriter, *http.Request)
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

// ActivityApiServicer defines the api actions for the ActivityApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type ActivityApiServicer interface {
	GetSexActivityByDate(context.Context, int64, string) (ImplResponse, error)
}

// BleedingApiServicer defines the api actions for the BleedingApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type BleedingApiServicer interface {
	GetBleedingByDate(context.Context, int64, string) (ImplResponse, error)
}

// CervicalApiServicer defines the api actions for the CervicalApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type CervicalApiServicer interface {
	GetCervicalByDate(context.Context, int64, string) (ImplResponse, error)
}

// CervixApiServicer defines the api actions for the CervixApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type CervixApiServicer interface {
	GetCervixByDate(context.Context, int64, string) (ImplResponse, error)
}

// DayApiServicer defines the api actions for the DayApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type DayApiServicer interface {
	CreateDayEntry(context.Context, int64, Day) (ImplResponse, error)
	GetDayByUserAndRange(context.Context, int64, string, string) (ImplResponse, error)
	GetDaysByUserIdAndDate(context.Context, int64, []string) (ImplResponse, error)
	UpdateDayEntry(context.Context, int64, Day) (ImplResponse, error)
}

// DesireApiServicer defines the api actions for the DesireApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type DesireApiServicer interface {
	GetSexDesireByDate(context.Context, int64, string) (ImplResponse, error)
}

// MoodApiServicer defines the api actions for the MoodApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type MoodApiServicer interface {
	GetMoodByDate(context.Context, int64, string) (ImplResponse, error)
}

// PainApiServicer defines the api actions for the PainApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type PainApiServicer interface {
	GetPainByDate(context.Context, int64, string) (ImplResponse, error)
}

// TemperatureApiServicer defines the api actions for the TemperatureApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type TemperatureApiServicer interface {
	GetTemperatureByDate(context.Context, int64, string) (ImplResponse, error)
}

// UserApiServicer defines the api actions for the UserApi service
// This interface intended to stay up to date with the openapi yaml used to generate it,
// while the service implementation can ignored with the .openapi-generator-ignore file
// and updated with the logic required for the API.
type UserApiServicer interface {
	CreateUser(context.Context, User) (ImplResponse, error)
	GetRestoreData(context.Context, int64) (ImplResponse, error)
	GetUserById(context.Context, int64) (ImplResponse, error)
	UpdateUser(context.Context, int64, User) (ImplResponse, error)
}
