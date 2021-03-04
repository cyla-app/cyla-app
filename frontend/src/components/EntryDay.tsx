import { View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { Button, Subheading } from 'react-native-paper'
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

const PropertyHeadline = ({ children }: { children: React.ReactNode }) => (
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
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <EntryTemperature
        initialString={''}
        onTemperatureChanged={setTemperature}
      />

      <>
        <PropertyHeadline>Bleeding Strength</PropertyHeadline>

        <EntryBleeding
          strength={bleedingStrength}
          onStrengthChanged={setBleedingStrength}
        />
      </>

      <>
        <PropertyHeadline>Mucus</PropertyHeadline>

        <EntryMucus
          feeling={mucusFeeling}
          onFeelingChanged={setMucusFeeling}
          texture={mucusTexture}
          onTextureChanged={setMucusTexture}
        />
      </>

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
        style={{ borderRadius: 30, margin: 10 } as ViewStyle}>
        Save
      </Button>
    </View>
  )
}
