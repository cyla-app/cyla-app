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

// A CervicalApiController binds http requests to an api service and writes the service results to the http response
type CervicalApiController struct {
	service CervicalApiServicer
}

// NewCervicalApiController creates a default api controller
func NewCervicalApiController(s CervicalApiServicer) Router {
	return &CervicalApiController{service: s}
}

// Routes returns all of the api route for the CervicalApiController
func (c *CervicalApiController) Routes() Routes {
	return Routes{
		{
			"GetCervicalByDate",
			strings.ToUpper("Get"),
			"/cervical/{userId}",
			c.GetCervicalByDate,
		},
	}
}

// GetCervicalByDate -
func (c *CervicalApiController) GetCervicalByDate(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := r.URL.Query()
	userId := params["userId"]
	date := query.Get("date")
	result, err := c.service.GetCervicalByDate(r.Context(), userId, date)
	//If an error occured, encode the error with the status code
	if err != nil {
		EncodeJSONResponse(err.Error(), &result.Code, w)
		return
	}
	//If no error, encode the body and the result code
	EncodeJSONResponse(result.Body, &result.Code, w)

}
