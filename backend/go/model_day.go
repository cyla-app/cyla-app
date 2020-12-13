/*
 * Cyla App API
 *
 * API for the period tracking app 'Cyla'
 *
 * API version: 0.1.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package server

// Day - A Day entry
type Day struct {

	// Day key used to encrypt sensitive information for the day.
	DayKey string `json:"day_key,omitempty" mapstructure:"DayKey"`

	Version string `json:"version,omitempty" mapstructure:"Version"`

	Date string `json:"date,omitempty" mapstructure:"Date"`

	DayInfo string `json:"dayInfo,omitempty" mapstructure:"DayInfo"`
}

func GetDayDayKeyName() string {
	return "DayKey"
}
func GetDayVersionName() string {
	return "Version"
}
func GetDayDateName() string {
	return "Date"
}
func GetDayDayInfoName() string {
	return "DayInfo"
}