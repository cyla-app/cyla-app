/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// ShareInfo - Information needed to publish/share a set of days
type ShareInfo struct {
	Days []Day `json:"days,omitempty" mapstructure:"Days"`

	SharedKeyBackup EncryptedAttribute `json:"sharedKeyBackup,omitempty" mapstructure:"SharedKeyBackup"`
}

func GetShareInfoDaysName() string {
	return "Days"
}
func GetShareInfoSharedKeyBackupName() string {
	return "SharedKeyBackup"
}