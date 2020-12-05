import React from 'react'
import { View } from 'react-native'
import { Headline, Text, useTheme } from 'react-native-paper'

export default () => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 250,
          height: 250,
          borderRadius: 250 / 2,
          backgroundColor: colors.surface,
          borderStyle: 'solid',
          borderColor: colors.primary,
          borderWidth: 2,
        }}>
        <Text>Period in</Text>
        <Headline>3 days</Headline>
      </View>
    </View>
  )
}
