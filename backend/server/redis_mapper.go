package server

import "github.com/mitchellh/mapstructure"

func flatStructToStringList(inputStruct interface{}) (ret []interface{}, err error) {
	var mapTmp map[string]interface{}
	err = mapstructure.Decode(inputStruct, &mapTmp)
	for k, v := range mapTmp {
		ret = append(ret, k, v)
	}
	return ret, err
}
