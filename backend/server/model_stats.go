/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Stats - Data structures used by Cyla to compute stats like average Period length.
type Stats struct {
	PeriodLengthStructure EncryptedAttribute `json:"periodLengthStructure,omitempty" mapstructure:"PeriodLengthStructure"`
}

func GetStatsPeriodLengthStructureName() string {
	return "PeriodLengthStructure"
}