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
    "github.com/cossacklabs/themis/gothemis/compare"
    "github.com/gorilla/websocket"
    "log"
)

// LoginApiService is a service that implents the logic for the LoginApiServicer
// This service should implement the business logic for every endpoint for the LoginApi API.
// Include any external packages or services that will be required by this service.
type LoginApiService struct {
}

// NewLoginApiService creates a default api service
func NewLoginApiService() LoginApiServicer {
	return &LoginApiService{}
}

// LoginUser -
func (s *LoginApiService) LoginUser(ctx context.Context, username string, conn *websocket.Conn) (ImplResponse, error) {
	ret, err := DBConnection.LoginUser(ctx, username)
    comparisonServer, err := compare.New()
    comparisonServer.Append([]byte(ret))
    for {
        mt, message, err := conn.ReadMessage()
        if err != nil {
            log.Println("read:", err)
            break
        }
        log.Printf("recv: %s", message)
        log.Println(message)

        response, err := comparisonServer.Proceed(message)
        if err != nil {
            log.Println("Comparison error: ", err)
        }

        err = conn.WriteMessage(mt, response)
        if err != nil {
            log.Println("write:", err)
            break
        }
        if response == nil {
            log.Println("Comparison done")
            break
        }
    }
    result, err := comparisonServer.Result()
    if err != nil {
        log.Println("Error during result: ", err)
    }
    if result == compare.Match {
        log.Println("Successful")
    }
	return httpResponseWithBody(ret, err)
}
