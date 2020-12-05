import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import { View } from 'react-native'

export default () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      <MaterialCommunityIcons
        size={100}
        name={'format-paint'}
        style={{ marginTop: 5 }}
      />
    </View>
  )
}
