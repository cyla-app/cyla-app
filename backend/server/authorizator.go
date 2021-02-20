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

type CylaUserClaims struct {
	UUID string `json:"uuid"`
	jwt.StandardClaims
}

type CylaShareClaims struct {
	ShareId string `json:"shareId"`
	jwt.StandardClaims
}

var errResult = ImplResponse{
	Code: http.StatusUnauthorized,
	Body: "Invalid claims",
}

type checkValidToken func(*jwt.Token, string) bool

type authFunc func(w http.ResponseWriter, r *http.Request) (isAuthorized bool)

func authorizationChain(w http.ResponseWriter, r *http.Request, sliceFunc []authFunc) (isAuthorized bool) {
	for _, authFunc := range sliceFunc {
		isAuthorized = authFunc(w, r)
		if isAuthorized {
			return
		}
	}
	return
}

func processRequestWithAuth(baseFunc http.HandlerFunc, sliceFunc []authFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if authorizationChain(w, r, sliceFunc) {
			baseFunc.ServeHTTP(w, r)
		} else {
			encodeUnauthError(w)
		}
	}
}

func authorizeBasedOnClaim(
	claimName string,
	emptyClaimStruct jwt.Claims,
	checkValidToken checkValidToken) authFunc {

	return func(w http.ResponseWriter, r *http.Request) (isAuthorized bool) {
		vars := mux.Vars(r)
		claim := vars[claimName]
		var jwtString string
		splitAuthHeader := strings.Split(r.Header.Get("Authorization"), " ")
		if len(splitAuthHeader) != 2 {
			log.Println("Error while extraction jwt")
			return
		}
		jwtString = splitAuthHeader[1]
		token, err := jwt.ParseWithClaims(jwtString, emptyClaimStruct, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte("test"), nil
		})
		if err != nil {
			log.Println("Error while decoding", err)
			return
		}

		return checkValidToken(token, claim)
	}
}

func checkValidCylaUserToken(token *jwt.Token, claim string) (isValid bool) {
	claims, ok := token.Claims.(*CylaUserClaims)
	isValid = ok && token.Valid && claims.UUID == claim
	if !isValid {
		log.Printf("Error during claim check: claimed id %s vs expected id %s", claims.UUID, claim)
	}
	return
}

func checkValidCylaShareToken(token *jwt.Token, claim string) (isValid bool) {
	claims, ok := token.Claims.(*CylaShareClaims)
	isValid = ok && token.Valid && claims.ShareId == claim
	if !isValid {
		log.Printf("Error during claim check: claimed id %s vs expected id %s", claims.ShareId, claim)
	}
	return
}

func encodeUnauthError(w http.ResponseWriter) {
	EncodeJSONResponse(errResult.Body, &errResult.Code, nil, w)
}

func getJWTToken(uuid string) (string, error) {
	claims := CylaUserClaims{
		uuid,
		jwt.StandardClaims{
			//TODO: proper expiration time
			//TODO: Flow for JWT refresh
			//ExpiresAt: 15000000000,
			Issuer: "CylaServer",
		},
	}
	//TODO: User better encryption method, e.g. RS
	jwtString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("test"))
	return jwtString, err
}
