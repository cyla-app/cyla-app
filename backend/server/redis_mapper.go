package server

import (
	"errors"
	"github.com/mitchellh/mapstructure"
)

func flatStructToSlice(inputStruct interface{}) (ret []interface{}, err error) {
	var mapTmp map[string]interface{}
	err = mapstructure.Decode(inputStruct, &mapTmp)
	for k, v := range mapTmp {
		ret = append(ret, k, v)
	}
	return ret, err
}

// structPointer should be a pointer to an interface, in order to use mapstructure
func stringSliceToFlatStruct(stringList []interface{}, structPointer interface{}) (err error) {
	ret := make(map[interface{}]interface{})
	if len(stringList)%2 != 0 {
		return errors.New("malformed slice. Length should be even")
	}
	for i := 0; i < len(stringList); i = i + 2 {
		ret[stringList[i]] = stringList[i+1]
	}
	err = mapstructure.WeakDecode(ret, structPointer)
	return err
}
