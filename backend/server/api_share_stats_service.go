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
)

// ShareStatsApiService is a service that implents the logic for the ShareStatsApiServicer
// This service should implement the business logic for every endpoint for the ShareStatsApi API.
// Include any external packages or services that will be required by this service.
type ShareStatsApiService struct {
}

// NewShareStatsApiService creates a default api service
func NewShareStatsApiService() ShareStatsApiServicer {
	return &ShareStatsApiService{}
}

// ShareGetPeriodStats -
func (s *ShareStatsApiService) ShareGetPeriodStats(ctx context.Context, shareId string, userId string) (response ImplResponse, err error) {
	ret, err := DBConnection.ShareGetPeriodStats(ctx, shareId, userId)
	response, err = httpResponseWithBody(ret, err)
	if response.Code == 200 {
		response.Headers = []Header{{Name: "Cache-Control", Value: "max-age=86400"}}
	}
	return
}

// ShareGetStats -
func (s *ShareStatsApiService) ShareGetStats(ctx context.Context, shareId string, userId string) (response ImplResponse, err error) {
	ret, err := DBConnection.ShareGetStats(ctx, shareId, userId)
	response, err = httpResponseWithBody(ret, err)
	if response.Code == 200 {
		response.Headers = []Header{{Name: "Cache-Control", Value: "max-age=86400"}}
	}
	return
}
