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
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// A DayApiController binds http requests to an api service and writes the service results to the http response
type DayApiController struct {
	service DayApiServicer
}

// NewDayApiController creates a default api controller
func NewDayApiController(s DayApiServicer) Router {
	return &DayApiController{service: s}
}

// Routes returns all of the api route for the DayApiController
func (c *DayApiController) Routes() Routes {
	return Routes{
		{
			"GetDayByUserAndRange",
			strings.ToUpper("Get"),
			"/day/{userId}/byRange",
			Authorize(c.GetDayByUserAndRange, []authFunc{userJWTAuth}),
		},
		{
			"GetDaysByUserIdAndDate",
			strings.ToUpper("Get"),
			"/day/{userId}/byDate",
			Authorize(c.GetDaysByUserIdAndDate, []authFunc{userJWTAuth}),
		},
		{
			"ModifyDayEntry",
			strings.ToUpper("Post"),
			"/day/{userId}",
			Authorize(c.ModifyDayEntry, []authFunc{userJWTAuth}),
		},
		{
			"ModifyDayEntryWithStats",
			strings.ToUpper("Post"),
			"/day/{userId}/withStats",
			Authorize(c.ModifyDayEntryWithStats, []authFunc{userJWTAuth}),
		},
	}
}

// GetDayByUserAndRange -
func (c *DayApiController) GetDayByUserAndRange(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := r.URL.Query()
	userId := params["userId"]
	startDate := query.Get("startDate")
	endDate := query.Get("endDate")
	result, err := c.service.GetDayByUserAndRange(r.Context(), userId, startDate, endDate)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}

// GetDaysByUserIdAndDate -
func (c *DayApiController) GetDaysByUserIdAndDate(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := r.URL.Query()
	userId := params["userId"]
	date := strings.Split(query.Get("date"), ",")
	result, err := c.service.GetDaysByUserIdAndDate(r.Context(), userId, date)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}

// ModifyDayEntry -
func (c *DayApiController) ModifyDayEntry(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userId := params["userId"]
	day := &Day{}
	if err := json.NewDecoder(r.Body).Decode(&day); err != nil {
		w.WriteHeader(500)
		return
	}

	result, err := c.service.ModifyDayEntry(r.Context(), userId, *day)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}

// ModifyDayEntryWithStats -
func (c *DayApiController) ModifyDayEntryWithStats(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userId := params["userId"]
	dayStatsUpdate := &DayStatsUpdate{}
	if err := json.NewDecoder(r.Body).Decode(&dayStatsUpdate); err != nil {
		w.WriteHeader(500)
		return
	}

	result, err := c.service.ModifyDayEntryWithStats(r.Context(), userId, *dayStatsUpdate)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}
