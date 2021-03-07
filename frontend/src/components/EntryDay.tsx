import { View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { Button, Divider, Subheading } from 'react-native-paper'
import {
  BleedingStrength,
  Day,
  ExcludeReason,
  MucusFeeling,
  MucusTexture,
  Temperature,
} from '../types'
import EntryBleeding from './EntryBleeding'
import EntryTemperature from './EntryTemperature'
import EntryMucus from './EntryMucus'

export const PropertyHeadline = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <Subheading style={{ marginTop: 10, fontWeight: '700' }}>
    {children}
  </Subheading>
)

type PropsType = {
  onSave: (day: Day) => void
  selectedDate: string
}

export default ({ onSave, selectedDate }: PropsType) => {
  const [temperature, setTemperature] = useState<Temperature['value'] | null>(
    null,
  )
  const [bleedingStrength, setBleedingStrength] = useState<BleedingStrength>(
    BleedingStrength.STRENGTH_NONE,
  )
  const [mucusFeeling, setMucusFeeling] = useState<MucusFeeling>(
    MucusFeeling.FEELING_NONE,
  )
  const [mucusTexture, setMucusTexture] = useState<MucusTexture>(
    MucusTexture.TEXTURE_NONE,
  )
  /*  const [excludeReason, setExcludeReason] = useState<ExcludeReason>(
    ExcludeReason.EXCLUDE_REASON_NONE,
  )*/

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View style={{ alignItems: 'center', margin: 10 }}>
        <EntryTemperature
          initialString={''}
          onTemperatureChanged={setTemperature}
        />
      </View>

      <Divider />

      <View style={{ alignItems: 'center', margin: 10 }}>
        <PropertyHeadline>Bleeding Strength</PropertyHeadline>

        <EntryBleeding
          strength={bleedingStrength}
          onStrengthChanged={setBleedingStrength}
        />
      </View>

      <Divider />
      <View style={{ alignItems: 'center', margin: 10 }}>
        <EntryMucus
          feeling={mucusFeeling}
          onFeelingChanged={setMucusFeeling}
          texture={mucusTexture}
          onTextureChanged={setMucusTexture}
        />
      </View>

      <Divider />

      {/*<PropertyHeadline>Exclude</PropertyHeadline>

      <EntryExclude
        excludeReason={excludeReason}
        onExcludeReasonChanged={setExcludeReason}
      />*/}

      <Button
        onPress={() => {
          onSave({
            temperature: temperature
              ? {
                  value: temperature,
                  timestamp: new Date().toISOString(),
                  note: 'Note',
                  excludeReason: ExcludeReason.EXCLUDE_REASON_NONE,
                }
              : undefined,
            bleeding: {
              strength: bleedingStrength,
            },
            mucus: {
              texture: mucusTexture,
              feeling: mucusFeeling,
            },
            date: selectedDate,
          })
        }}
        mode="outlined"
        style={
          {
            borderRadius: 30,
            margin: 10,
            width: 100,
            alignSelf: 'center',
          } as ViewStyle
        }>
        Save
      </Button>
    </View>
  )
}
