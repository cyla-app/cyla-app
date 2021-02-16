import { Text, View } from 'react-native'
import { ToggleButton } from 'react-native-paper'
import React from 'react'
import {
  BleedingStrength,
  CervixFirmness,
  CervixOpening,
  CervixPosition,
  ExcludeReason,
  MucusFeeling,
  MucusTexture,
} from '../types'

export default function <
  ValueType extends
    | BleedingStrength
    | CervixOpening
    | CervixFirmness
    | CervixPosition
    | ExcludeReason
    | MucusFeeling
    | MucusTexture
>({
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
  const changeValue = (newValue: string) => {
    onValueChange(parseInt(newValue ?? defaultValue, 10) as ValueType)
  }
  return (
    <ToggleButton.Group onValueChange={changeValue} value={value.toString()}>
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
                }}
                icon={button.icon}
                value={button.value.toString()}
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
