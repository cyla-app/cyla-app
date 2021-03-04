package server

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"gopkg.in/square/go-jose.v2"
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

type checkValidToken func(jwt.Claims, string) bool

type authFunc func(w http.ResponseWriter, r *http.Request) (isAuthorized bool)

func loadJWEKey(pemPath string) *rsa.PrivateKey {
	pemString, err := ioutil.ReadFile(pemPath)
	if err != nil {
		log.Fatalf("Error when loading JWEKey: %s", err)
	}
	block, _ := pem.Decode(pemString)
	pemPassword, _ := os.LookupEnv("PEM_PASSWORD")
	parseRet, err := x509.DecryptPEMBlock(block, []byte(pemPassword))
	if err != nil {
		log.Fatalf("Error when decrypting PEMblock: %s", err)
	}
	privateKey, err := x509.ParsePKCS1PrivateKey(parseRet)
	if err != nil {
		log.Fatalf("Error when parsing private key: %s", err)
	}

	return privateKey
}

var privateKey = loadJWEKey("resources/private.pem")

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
		jsonEncrypRec, err := jose.ParseEncrypted(jwtString)
		if err != nil {
			log.Println("Error when parsing encrypted JWE")
			return
		}
		encryptClaims, err := jsonEncrypRec.Decrypt(privateKey)
		if err != nil {
			log.Println("Error when decrypting JWE")
			return
		}

		err = json.Unmarshal(encryptClaims,emptyClaimStruct)
		if err != nil {
			log.Println("Error while decoding", err)
			return
		}

		return checkValidToken(emptyClaimStruct, claim)
	}
}

func checkValidCylaUserToken(claims jwt.Claims, expectedValue string) (isValid bool) {
	userClaims, ok := claims.(*CylaUserClaims)
	isValid = ok && userClaims.Valid() == nil && userClaims.UUID == expectedValue
	if !isValid {
		log.Printf("Error during claim check: claimed id %s vs expected id %s", userClaims, expectedValue)
	}
	return
}

func checkValidCylaShareToken(claims jwt.Claims, expectedValue string) (isValid bool) {
	shareClaims, ok := claims.(*CylaShareClaims)
	isValid = ok && shareClaims.Valid() == nil && shareClaims.ShareId == expectedValue
	if !isValid {
		log.Printf("Error during claim check: claimed id %s vs expected id %s", shareClaims.ShareId, expectedValue)
	}
	return
}

func encodeUnauthError(w http.ResponseWriter) {
	EncodeJSONResponse(errResult.Body, &errResult.Code, nil, w)
}

func getUserJWTToken(uuid string) (string, error) {

	claims := CylaUserClaims{
		uuid,
		jwt.StandardClaims{
			//TODO: proper expiration time
			//TODO: Flow for JWT refresh
			//ExpiresAt: 15000000000,
			Issuer: "CylaServer",
		},
	}

	return getJWEFromClaims(claims)
}

func getShareJWTToken(shareId string) (string, error) {
	claims := CylaShareClaims{
		shareId,
		jwt.StandardClaims{
			//TODO: proper expiration time
			//TODO: Flow for JWT refresh
			//ExpiresAt: 15000000000,
			Issuer: "CylaServer",
		},
	}

	return getJWEFromClaims(claims)
}

func getJWEFromClaims(claims jwt.Claims) (string, error) {
	publicKey := &privateKey.PublicKey
	// Ignore error, as the algorithms are supported
	encrypter, _ := jose.NewEncrypter(jose.A128GCM, jose.Recipient{Algorithm: jose.RSA_OAEP_256, Key: publicKey}, nil)
	ret, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}
	jsonEncryp, err := encrypter.Encrypt(ret)
	if err != nil {
		return "", err
	}

	jwtString, err := jsonEncryp.CompactSerialize()
	return jwtString, err
}
