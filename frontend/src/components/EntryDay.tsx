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
import EntryExclude from './EntryExclude'
import EntryTemperature from './EntryTemperature'
import EntryMucus from './EntryMucus'
import {
  Bleeding_Strength,
  Mucus_Feeling,
  Mucus_Texture,
} from '../../generated/day-info'

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
    Bleeding_Strength.STRENGTH_NONE,
  )
  const [mucusFeeling, setMucusFeeling] = useState<MucusFeeling>(
    Mucus_Feeling.FEELING_NONE,
  )
  const [mucusTexture, setMucusTexture] = useState<MucusTexture>(
    Mucus_Texture.TEXTURE_NONE,
  )
  const [excludeReason, setExcludeReason] = useState<ExcludeReason>(
    ExcludeReason.EXCLUDE_REASON_NONE,
  )

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

      <PropertyHeadline>Exclude</PropertyHeadline>

      <EntryExclude
        excludeReason={excludeReason}
        onExcludeReasonChanged={setExcludeReason}
      />

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
        mode="contained"
        style={{ borderRadius: 30, margin: 10 } as ViewStyle}>
        Save
      </Button>
    </View>
  )
}
