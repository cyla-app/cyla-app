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
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

export const TextIcon = ({ title }: { title: string }) => (
  <Text style={{ textAlign: 'center' }}>{title}</Text>
)

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
    icon: IconSource
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
            </View>
          )
        })}
      </View>
    </ToggleButton.Group>
  )
}
