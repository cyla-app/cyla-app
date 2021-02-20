/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// ShareInfoUpload - Information needed to publish/share a set of days
type ShareInfoUpload struct {
	Days []Day `json:"days,omitempty" mapstructure:"Days"`

	SharedKeyBackup EncryptedAttribute `json:"shared_key_backup,omitempty" mapstructure:"SharedKeyBackup"`

	// value for later authentication
	AuthKey string `json:"auth_key,omitempty" mapstructure:"AuthKey"`
}

func GetShareInfoUploadDaysName() string {
	return "Days"
}
func GetShareInfoUploadSharedKeyBackupName() string {
	return "SharedKeyBackup"
}
func GetShareInfoUploadAuthKeyName() string {
	return "AuthKey"
}
