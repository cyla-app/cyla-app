import { Text, View } from 'react-native'
import { ToggleButton } from 'react-native-paper'
import React from 'react'

export default function <ValueType extends string>({
  value,
  defaultValue,
  onValueChange,
  buttons,
}: {
  value: ValueType
  defaultValue: ValueType
  onValueChange: (value: ValueType) => void
  buttons: Array<{
    value: ValueType
    icon: string
    title: string
  }>
}) {
  const changeValue: (value: ValueType) => void = (newValue) => {
    onValueChange(newValue || defaultValue)
  }
  return (
    /* @ts-ignore */
    <ToggleButton.Group onValueChange={changeValue} value={value}>
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
