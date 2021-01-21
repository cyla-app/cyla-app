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
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/cossacklabs/themis/gothemis/compare"
	"github.com/gorilla/websocket"
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
	const timeout = time.Second * 12
	isAuthSuccessful := false
	closeReason := ""

	authData, err := DBConnection.LoginUser(ctx, username)
	if err != nil {
		log.Println("Error while retrieving hash key")
		closeReason = "Hashed key not found or corrupted"
	}

	hashKeyDecoded, err := base64.StdEncoding.DecodeString(authData.authKey)
	log.Println("Decoded", hashKeyDecoded)
	if err != nil {
		log.Println("Error while decoding hashKey")
		closeReason = "Decode error"
	}
	if closeReason == "" {
		closeReason = "Unexpected Error"
		comparisonServer, _ := compare.New()
		comparisonServer.Append(hashKeyDecoded)
		log.Println("Starting auth")
		conn.SetReadDeadline(time.Now().Add(timeout))
		for {
			mt, message, err := conn.ReadMessage()
			conn.SetReadDeadline(time.Now().Add(timeout))
			if err != nil {
				log.Println("read:", err)
				break
			}
			if mt != websocket.BinaryMessage {
				msg := "unexpected message type"
				err = errors.New(msg)
				log.Println(msg)
				break
			}

			response, err := comparisonServer.Proceed(message)
			if err != nil {
				log.Println("Comparison error: ", err)
				break
			}

			err = conn.WriteMessage(websocket.BinaryMessage, response)
			if err != nil {
				log.Println("write:", err)
				break
			}

			//Get result of comparison to see if it is done and send the final answer to the client
			comparisonStatus, err := comparisonServer.Result()
			if err != nil {
				log.Println("Comparison state error:", err)
			}
			if comparisonStatus == compare.Match {
				log.Println("Comparison successful")
				isAuthSuccessful = true
				sendJWT(authData, &closeReason, conn)
			}
			if comparisonStatus == compare.NoMatch {
				log.Println("Comparison unsuccessful")
				closeReason = "Validation unsuccessful"
				break
			}

			if err != nil {
				log.Println("write:", err)
				break
			}
		}
	}
	if !isAuthSuccessful {
		log.Println("Login Done with error")
		_ = conn.WriteMessage(websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseInternalServerErr, closeReason))
		return httpResponse(err)
	} else {
		log.Println("Login Done successfully")
		return httpResponseWithBody(authData, err)
	}
}

func sendJWT(authData *successfulAuthData, closeReason *string, conn *websocket.Conn) {
	//TODO: Use encrypted token
	token, err := getJWTToken(authData.UUID)
	if err != nil {
		log.Println("Error", err)
		*closeReason = err.Error()
		err = conn.WriteMessage(websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseInternalServerErr, *closeReason))
	} else {
		var authMsg = SuccessfulAuthMsg{
			JWT:                token,
			successfulAuthData: *authData,
		}
		jsonObj, _ := json.Marshal(authMsg)
		err = conn.WriteMessage(websocket.BinaryMessage, jsonObj)
	}
}
