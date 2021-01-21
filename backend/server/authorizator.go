package server

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

type successfulAuthData struct {
	UserKey string `json:"userKey"`
	UUID    string `json:"uuid"`
	authKey string
}

type SuccessfulAuthMsg struct {
	successfulAuthData
	JWT string `json:"jwt"`
}

type CylaClaims struct {
	UUID string `json:"uuid"`
	jwt.StandardClaims
}

var Authorize = authorizeBasedOnUserId

func authorizeBasedOnUserId(baseFunc func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		errResult := ImplResponse{
			Code: http.StatusUnauthorized,
			Body: "Invalid claims",
		}
		vars := mux.Vars(r)
		userId := vars["userId"]
		var jwtString string
		splitAuthHeader := strings.Split(r.Header.Get("Authorization"), " ")
		if len(splitAuthHeader) != 2 {
			log.Println("Error while extraction jwt")
			EncodeJSONResponse(errResult.Body, &errResult.Code, w)
			return
		}
		jwtString = splitAuthHeader[1]
		token, err := jwt.ParseWithClaims(jwtString, &CylaClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte("test"), nil
		})
		if err != nil {
			log.Println("Error while decoding", err)
			EncodeJSONResponse(errResult.Body, &errResult.Code, w)
			return
		}

		if claims, ok := token.Claims.(*CylaClaims); ok && token.Valid && claims.UUID == userId {
			baseFunc(w, r)
		} else {
			log.Printf("Error during claim check: claimed id %s vs expected id %s", claims.UUID, userId)
			EncodeJSONResponse(errResult.Body, &errResult.Code, w)
		}
	}
}

func getJWTToken(uuid string) (string, error) {
	claims := CylaClaims{
		uuid,
		jwt.StandardClaims{
			//TODO: proper expiration time
			//TODO: Flow for JWT refresh
			//ExpiresAt: 15000000000,
			Issuer:    "CylaServer",
		},
	}
	//TODO: User better encryption method, e.g. RS
	jwtString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("test"))
	return jwtString, err
}
