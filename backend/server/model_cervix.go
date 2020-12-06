/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Cervix - Cervix information for a day
type Cervix struct {

	// UUID
	Id string `json:"id,omitempty" mapstructure:"Id"`

	Opening EncryptedAttribute `json:"opening,omitempty" mapstructure:"Opening"`

	Firmness EncryptedAttribute `json:"firmness,omitempty" mapstructure:"Firmness"`

	Position EncryptedAttribute `json:"position,omitempty" mapstructure:"Position"`

	Excluce EncryptedAttribute `json:"excluce,omitempty" mapstructure:"Excluce"`
}
