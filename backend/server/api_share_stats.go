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

// A ShareStatsApiController binds http requests to an api service and writes the service results to the http response
type ShareStatsApiController struct {
	service ShareStatsApiServicer
}

// NewShareStatsApiController creates a default api controller
func NewShareStatsApiController(s ShareStatsApiServicer) Router {
	return &ShareStatsApiController{service: s}
}

// Routes returns all of the api route for the ShareStatsApiController
func (c *ShareStatsApiController) Routes() Routes {
	return Routes{
		{
			"ShareGetPeriodStats",
			strings.ToUpper("Get"),
			"/share/{shareId}/stats/periodStats",
			Authorize(c.ShareGetPeriodStats, []authFunc{shareJWTAuth}),
		},
		{
			"ShareGetStats",
			strings.ToUpper("Get"),
			"/share/{shareId}/stats",
			Authorize(c.ShareGetStats, []authFunc{shareJWTAuth}),
		},
	}
}

// ShareGetPeriodStats -
func (c *ShareStatsApiController) ShareGetPeriodStats(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	shareId := params["shareId"]
	result, err := c.service.ShareGetPeriodStats(r.Context(), shareId)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}

// ShareGetStats -
func (c *ShareStatsApiController) ShareGetStats(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	shareId := params["shareId"]
	result, err := c.service.ShareGetStats(r.Context(), shareId)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, result.Headers, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, result.Headers, w)

}