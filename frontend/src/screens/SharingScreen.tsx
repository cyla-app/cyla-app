import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Headline } from 'react-native-paper'
import ShareForm from '../components/ShareForm'

export default () => {
  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle

  return (
    <View style={containerStyle}>
      <Headline>Share</Headline>
      <ShareForm />
    </View>
  )
}
