/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Temperature - Temperature information for a day
type Temperature struct {

	// UUID
	Id string `json:"id,omitempty" mapstructure:"Id"`

	Value EncryptedAttribute `json:"value,omitempty" mapstructure:"Value"`

	Timestamp EncryptedAttribute `json:"timestamp,omitempty" mapstructure:"Timestamp"`

	Note EncryptedAttribute `json:"note,omitempty" mapstructure:"Note"`

	Exclude EncryptedAttribute `json:"exclude,omitempty" mapstructure:"Exclude"`
}
