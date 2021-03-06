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
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"

	"github.com/gorilla/mux"
)

// A LoginApiController binds http requests to an api service and writes the service results to the http response
type LoginApiController struct {
	service LoginApiServicer
}

// NewLoginApiController creates a default api controller
func NewLoginApiController(s LoginApiServicer) Router {
	return &LoginApiController{service: s}
}

// Routes returns all of the api route for the LoginApiController
func (c *LoginApiController) Routes() Routes {
	return Routes{
		{
			"LoginUser",
			strings.ToUpper("Get"),
			"/login/{username}",
			c.LoginUser,
		},
	}
}

// LoginUser -
func (c *LoginApiController) LoginUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	username := params["username"]

	var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool {
		return true
	}}
	log.Println("Upgrading to WS")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		var status = 500
		EncodeJSONResponse(err.Error(), &status, nil, w)
	}
	defer conn.Close()
	_, err = c.service.LoginUser(r.Context(), username, conn)
	//If an error occured, encode the error with the status code
	if err != nil {
		log.Println("error during login: ", err)
		return
	}
}
