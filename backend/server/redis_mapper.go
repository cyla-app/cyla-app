package server

import (
	"errors"
	"fmt"

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
func stringSliceToFlatStruct(valueList []interface{}, structPointer interface{}) (err error) {
	ret := make(map[string]interface{})
	if len(valueList)%2 != 0 {
		return errors.New("malformed slice. Length should be even")
	}

	for i := 0; i < len(valueList); i = i + 2 {
		var key = valueList[i]
		switch v := key.(type) {
		case string:
			ret[fmt.Sprintf("%v", key)] = valueList[i+1]
		default:
			fmt.Printf("I don't know about type %T!\n", v)
		}
	}

	err = mapstructure.Decode(ret, structPointer)
	return err
}
