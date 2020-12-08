import { View } from 'react-native'
import React, { useState } from 'react'
import RadioButtonGroup from './RadioButtonGroup'
import TemperatureEdit from './TemperatureEdit'
import { Subheading } from 'react-native-paper'

// import Slider from '@react-native-community/slider'

type ExcludeReasonValue = 'not defined' | 'sick' | 'sleep' | 'hungover'
type BleedingValue = 'not defined' | 'period' | 'spotting'

interface DayData {
  temperature?: number
  excludeReason: ExcludeReasonValue
  bleeding: BleedingValue
}

const PropertyHeadline = ({ children }: { children: React.ReactNode }) => (
  <Subheading
    style={{
      marginTop: 30,
    }}>
    {children}
  </Subheading>
)

export default () => {
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
        margin: 10,
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

      {/*<Slider*/}
      {/*  style={{ width: 200, height: 40 }}*/}
      {/*  minimumValue={0}*/}
      {/*  maximumValue={1}*/}
      {/*  minimumTrackTintColor="#FFFFFF"*/}
      {/*  maximumTrackTintColor="#000000"*/}
      {/*/>*/}
    </View>
  )
}
