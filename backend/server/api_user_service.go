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
	"errors"
	"net/http"
)

// UserApiService is a service that implents the logic for the UserApiServicer
// This service should implement the business logic for every endpoint for the UserApi API.
// Include any external packages or services that will be required by this service.
type UserApiService struct {
}

// NewUserApiService creates a default api service
func NewUserApiService() UserApiServicer {
	return &UserApiService{}
}

// CreateUser -
func (s *UserApiService) CreateUser(ctx context.Context, user User) (ImplResponse, error) {
	userId, err := DBConnection.SaveUser(ctx, user)
	if err != nil {
		return Response(400, err),nil
	} else {
		return Response(200, userId), nil

	}
}

// GetRestoreData -
func (s *UserApiService) GetRestoreData(ctx context.Context, userId string) (ImplResponse, error) {
	// TODO - update GetRestoreData with the required logic for this service method.
	// Add api_user_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, string{}) or use other options such as http.Ok ...
	//return Response(200, string{}), nil

	//TODO: Uncomment the next line to return response Response(404, {}) or use other options such as http.Ok ...
	//return Response(404, nil),nil

	return Response(http.StatusNotImplemented, nil), errors.New("GetRestoreData method not implemented")
}

// GetUserById -
func (s *UserApiService) GetUserById(ctx context.Context, userId string) (ImplResponse, error) {
	user, err := DBConnection.GetUser(ctx, userId)
	if err != nil {
		return Response(404, user), err
	} else {
		return Response(200, user), nil
	}
}

// UpdateUser -
func (s *UserApiService) UpdateUser(ctx context.Context, userId string, user User) (ImplResponse, error) {
	// TODO - update UpdateUser with the required logic for this service method.
	// Add api_user_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.

	//TODO: Uncomment the next line to return response Response(200, {}) or use other options such as http.Ok ...
	//return Response(200, nil),nil

	//TODO: Uncomment the next line to return response Response(400, {}) or use other options such as http.Ok ...
	//return Response(400, nil),nil

	return Response(http.StatusNotImplemented, nil), errors.New("UpdateUser method not implemented")
}
