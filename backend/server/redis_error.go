package server

import "fmt"

type HttpError struct {
	Code int
	causeMsg string
	msg string

}

func newHTTPError(code int, msg string) error {
	return &HttpError{
		Code: code,
		msg: fmt.Sprintf("%d error - %v", code, msg),
	}
}

func newHTTPErrorWithCauseError(code int, msg string, cause error) error {
	return &HttpError{
		Code: code,
		msg: fmt.Sprintf("%d error - %v: %v", code, msg, cause),
	}
}

func (s *HttpError) Error() string {
	return s.msg

}
