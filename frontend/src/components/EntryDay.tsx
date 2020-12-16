import { View } from 'react-native'
import React, { useState } from 'react'
import { Button, Subheading } from 'react-native-paper'
import {
  Bleeding,
  Day,
  ExcludeReason,
  Mucus,
  Temperature,
} from '../../generated'
import EntryBleeding from './EntryBleeding'
import EntryExclude from './EntryExclude'
import EntryTemperature from './EntryTemperature'
import EntryMucus from './EntryMucus'

const PropertyHeadline = ({ children }: { children: React.ReactNode }) => (
  <Subheading>{children}</Subheading>
)

export default ({ onSave }: { onSave: (day: Day) => void }) => {
  const [temperature, setTemperature] = useState<Temperature['value']>(0)
  const [bleedingStrength, setBleedingStrength] = useState<Bleeding.strength>(
    Bleeding.strength.NONE,
  )
  const [mucusFeeling, setMucusFeeling] = useState<Mucus.feeling>(
    Mucus.feeling.NONE,
  )
  const [mucusTexture, setMucusTexture] = useState<Mucus.texture>(
    Mucus.texture.NONE,
  )
  const [excludeReason, setExcludeReason] = useState<ExcludeReason>(
    ExcludeReason.NONE,
  )

  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <EntryTemperature
        initialString={''}
        onTemperatureChanged={setTemperature}
      />

      <PropertyHeadline>Bleeding Strength</PropertyHeadline>

      <EntryBleeding
        strength={bleedingStrength}
        onStrengthChanged={setBleedingStrength}
      />

      <PropertyHeadline>Mucus</PropertyHeadline>

      <EntryMucus
        feeling={mucusFeeling}
        onFeelingChanged={setMucusFeeling}
        texture={mucusTexture}
        onTextureChanged={setMucusTexture}
      />

      <PropertyHeadline>Exclude</PropertyHeadline>

      <EntryExclude
        excludeReason={excludeReason}
        onExcludeReasonChanged={setExcludeReason}
      />

      <Button
        onPress={() => {
          onSave({
            temperature: {
              value: temperature,
              timestamp: new Date().toISOString(),
              note: undefined,
            },
            bleeding: {
              strength: Bleeding.strength.STRONG,
            },
            mucus: {
              texture: mucusTexture,
              feeling: mucusFeeling,
            },
          })
        }}
        mode="contained"
        style={{ borderRadius: 30 }}>
        Add day
      </Button>
    </View>
  )
}
