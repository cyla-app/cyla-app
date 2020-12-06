/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// SexualActivity - Sexual activity information for a day
type SexualActivity struct {

	// UUID
	Id string `json:"id,omitempty" mapstructure:"Id"`

	Type EncryptedAttribute `json:"type,omitempty" mapstructure:"Type"`

	Contraceptives EncryptedAttribute `json:"contraceptives,omitempty" mapstructure:"Contraceptives"`
}

func (s *SexualActivity) GetIdFieldName() string {
	return "Id"
}
func (s *SexualActivity) GetTypeFieldName() string {
	return "Type"
}
func (s *SexualActivity) GetContraceptivesFieldName() string {
	return "Contraceptives"
}
