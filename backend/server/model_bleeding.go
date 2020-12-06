/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Bleeding - Bleeding information for a day
type Bleeding struct {

	// UUID
	Id string `json:"id,omitempty" mapstructure:"Id"`

	Strength EncryptedAttribute `json:"strength,omitempty" mapstructure:"Strength"`

	Exclude EncryptedAttribute `json:"exclude,omitempty" mapstructure:"Exclude"`
}

func (s *Bleeding) GetIdFieldName() string {
	return "Id"
}
func (s *Bleeding) GetStrengthFieldName() string {
	return "Strength"
}
func (s *Bleeding) GetExcludeFieldName() string {
	return "Exclude"
}
