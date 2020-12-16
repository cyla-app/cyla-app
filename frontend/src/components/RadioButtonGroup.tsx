import { Text, View } from 'react-native'
import { ToggleButton, useTheme } from 'react-native-paper'
import React from 'react'

export default function <ValueType extends string>({
  value,
  onValueChange,
  buttons,
}: {
  value: ValueType
  onValueChange: (value: ValueType) => void
  buttons: Array<{
    value: ValueType
    icon: string
    title: string
  }>
}) {
  return (
    /* @ts-ignore */
    <ToggleButton.Group onValueChange={onValueChange} value={value}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {buttons.map((button) => {
          return (
            <View
              key={button.value}
              style={{
                flexDirection: 'column',
                marginLeft: 15,
                marginRight: 15,
              }}>
              <ToggleButton
                style={{
                  width: 60,
                  // backgroundColor: useTheme().colors.buttonBackground,
                }}
                icon={button.icon}
                value={button.value}
              />
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {button.title}
              </Text>
            </View>
          )
        })}
      </View>
    </ToggleButton.Group>
  )
}
