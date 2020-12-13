/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

import "log"

func httpResponse(err error) (ImplResponse, error) {
	return httpResponseWithBody(nil, err)
}

func httpResponseWithBody(body interface{}, err error) (ImplResponse, error) {
	if err == nil {
		if body == nil {
			body = "Ok"
		}
		return Response(200, body), err
	}
	log.Printf("Error when handling request: %s", err)
	httpError, ok := err.(*HttpError)
	if ok {
		return Response(httpError.Code, nil), httpError
	} else {
		return Response(500, nil), err
	}
}