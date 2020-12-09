package server

import "fmt"

type HttpError struct {
	Code int
	causeMsg string
	msg string

}

func newHTTPError(code int, msg string, cause error) error {
	return &HttpError{
		Code: code,
		causeMsg: cause.Error(),
		msg: msg,
	}
}

func (s *HttpError) Error() string {
	return fmt.Sprintf("%d error %v %v", s.Code, s.msg, s.causeMsg)

}
