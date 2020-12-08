import { View } from 'react-native'
import React, { useState } from 'react'
import RadioButtonGroup from './RadioButtonGroup'
import TemperatureEdit from './TemperatureEdit'
import { Button, Subheading } from 'react-native-paper'
import { Day } from '../../generated'

// import Slider from '@react-native-community/slider'

type ExcludeReasonValue = 'not defined' | 'sick' | 'sleep' | 'hungover'
type BleedingValue = 'not defined' | 'period' | 'spotting'

interface DayData {
  temperature?: number
  excludeReason: ExcludeReasonValue
  bleeding: BleedingValue
}

const PropertyHeadline = ({ children }: { children: React.ReactNode }) => (
  <Subheading>{children}</Subheading>
)

export default ({ onAdd }: { onAdd: (day: Day) => void }) => {
  const [state, setState] = useState<DayData>({
    temperature: undefined,
    excludeReason: 'not defined',
    bleeding: 'not defined',
  })

  const { excludeReason, bleeding } = state

  const setTemperature = (newTemperature: number) => {
    setState({ ...state, temperature: newTemperature })
  }

  const setExcludeReason = (newExcludeReason: ExcludeReasonValue) =>
    setState({
      ...state,
      excludeReason: newExcludeReason,
    })

  const setBleeding = (newBleeding: BleedingValue) =>
    setState({
      ...state,
      bleeding: newBleeding,
    })

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <TemperatureEdit
        initialString={''}
        onTemperatureChange={setTemperature}
      />

      <PropertyHeadline>Exclude</PropertyHeadline>

      <RadioButtonGroup
        value={excludeReason}
        onValueChange={(value) => setExcludeReason(value as ExcludeReasonValue)}
        buttons={[
          {
            title: 'Sick',
            value: 'sick',
            icon: 'virus',
          },
          {
            title: 'Hungover',
            value: 'hungover',
            icon: 'glass-cocktail',
          },
          {
            title: 'Sleep',
            value: 'sleep',
            icon: 'sleep',
          },
        ]}
      />

      <PropertyHeadline>Bleeding</PropertyHeadline>

      <RadioButtonGroup
        value={bleeding}
        onValueChange={(value) => {
          setBleeding(value as BleedingValue)
        }}
        buttons={[
          {
            title: 'Period',
            value: 'period',
            icon: 'water',
          },
          {
            title: 'Spotting',
            value: 'spotting',
            icon: 'water',
          },
        ]}
      />

      <Button
        onPress={() => {
          onAdd({
            bleeding: undefined,
            cervical: undefined,
            cervix: undefined,
            sexActivity: undefined,
            sexDesire: undefined,
            pain: undefined,
            mood: undefined,
          })
        }}
        mode="contained"
        style={{ borderRadius: 30 }}>
        Add day
      </Button>
    </View>
  )
}
