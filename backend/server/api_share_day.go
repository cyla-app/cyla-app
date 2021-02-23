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
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// A ShareDayApiController binds http requests to an api service and writes the service results to the http response
type ShareDayApiController struct {
	service ShareDayApiServicer
}

// NewShareDayApiController creates a default api controller
func NewShareDayApiController(s ShareDayApiServicer) Router {
	return &ShareDayApiController{service: s}
}

// Routes returns all of the api route for the ShareDayApiController
func (c *ShareDayApiController) Routes() Routes {
	return Routes{
		{
			"ShareGetDayByUserAndRange",
			strings.ToUpper("Get"),
			"/share/{shareId}/day/byRange",
			Authorize(c.ShareGetDayByUserAndRange, []authFunc{shareJWTAuth}),
		},
		{
			"ShareGetDaysByUserIdAndDate",
			strings.ToUpper("Get"),
			"/share/{shareId}/day/byDate",
			Authorize(c.ShareGetDaysByUserIdAndDate, []authFunc{shareJWTAuth}),
		},
	}
}

// ShareGetDayByUserAndRange -
func (c *ShareDayApiController) ShareGetDayByUserAndRange(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := r.URL.Query()
	shareId := params["shareId"]
	startDate := query.Get("startDate")
	endDate := query.Get("endDate")
	result, err := c.service.ShareGetDayByUserAndRange(r.Context(), shareId, startDate, endDate)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}

// ShareGetDaysByUserIdAndDate -
func (c *ShareDayApiController) ShareGetDaysByUserIdAndDate(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := r.URL.Query()
	shareId := params["shareId"]
	date := strings.Split(query.Get("date"), ",")
	result, err := c.service.ShareGetDaysByUserIdAndDate(r.Context(), shareId, date)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}
