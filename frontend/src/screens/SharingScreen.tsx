import React from 'react'
import { View, ViewStyle } from 'react-native'
import ShareForm from '../components/ShareForm'

export default () => {
  const containerStyle: ViewStyle = {
    flex: 1,
    padding: 20,
  } as ViewStyle

  return (
    <View style={containerStyle}>
      <ShareForm />
    </View>
  )
}
