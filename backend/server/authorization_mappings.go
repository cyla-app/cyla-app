package server

//Extra file serving to define which specific functions the generated code calls for authentication/authorization
var Authorize = processRequestWithAuth

var userJWTAuth = authorizeBasedOnClaim("userId", &CylaUserClaims{}, checkValidCylaUserToken)
var shareJWTAuth = authorizeBasedOnClaim("shareId", &CylaShareClaims{}, checkValidCylaShareToken)
