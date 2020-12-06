/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Mood - Mood information for a day
type Mood struct {

	// UUID
	Id string `json:"id,omitempty" mapstructure:"Id"`

	Type EncryptedAttribute `json:"type,omitempty" mapstructure:"Type"`
}

func (s *Mood) GetIdFieldName() string {
	return "Id"
}
func (s *Mood) GetTypeFieldName() string {
	return "Type"
}
