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

// A TemperatureApiController binds http requests to an api service and writes the service results to the http response
type TemperatureApiController struct {
	service TemperatureApiServicer
}

// NewTemperatureApiController creates a default api controller
func NewTemperatureApiController(s TemperatureApiServicer) Router {
	return &TemperatureApiController{service: s}
}

// Routes returns all of the api route for the TemperatureApiController
func (c *TemperatureApiController) Routes() Routes {
	return Routes{
		{
			"GetTemperatureByDate",
			strings.ToUpper("Get"),
			"/temperature/{userId}",
			c.GetTemperatureByDate,
		},
	}
}

// GetTemperatureByDate -
func (c *TemperatureApiController) GetTemperatureByDate(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := r.URL.Query()
	userId, err := parseInt64Parameter(params["userId"])
	if err != nil {
		w.WriteHeader(500)
		return
	}
	date := query.Get("date")
	result, err := c.service.GetTemperatureByDate(r.Context(), userId, date)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}
