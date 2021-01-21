package server

import "github.com/dgrijalva/jwt-go"

type successfulAuthData struct {
	UserKey string `json:"userKey"`
	UUID string `json:"uuid"`
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
