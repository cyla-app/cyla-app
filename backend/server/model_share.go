/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Share - Info summarizing a set of shared days and statistics
type Share struct {

	// UUID
	Owner string `json:"owner,omitempty" mapstructure:"Owner"`

	// ISO-8601-formatted date for an day entry. Only the date, no time is given.
	ExpirationDate string `json:"expirationDate,omitempty" mapstructure:"ExpirationDate"`

	SharedKeyBackup EncryptedAttribute `json:"shared_key_backup,omitempty" mapstructure:"SharedKeyBackup"`

	// UUID
	ShareId string `json:"shareId,omitempty" mapstructure:"ShareId"`

	AuthKey CryptoHashedAttribute `json:"auth_key,omitempty" mapstructure:"AuthKey"`
}

func GetShareOwnerName() string {
	return "Owner"
}
func GetShareExpirationDateName() string {
	return "ExpirationDate"
}
func GetShareSharedKeyBackupName() string {
	return "SharedKeyBackup"
}
func GetShareShareIdName() string {
	return "ShareId"
}
func GetShareAuthKeyName() string {
	return "AuthKey"
}
