import { View } from 'react-native'
import React, { useState } from 'react'
import RadioButtonGroup from './RadioButtonGroup'
import TemperatureEdit from './TemperatureEdit'
import { Button, Subheading } from 'react-native-paper'
import { Day } from '../../generated'

// import Slider from '@react-native-community/slider'

type ExcludeReasonValue = 'not defined' | 'sick' | 'sleep' | 'hungover'
type BleedingValue = 'not defined' | 'period' | 'spotting'
type CervicalMucusFeeling = 'nothing' | 'dry' | 'wet' | 'slippery'
type CervicalMucusStructure = 'nothing' | 'creamy' | 'egg white'
type CervixOpening = 'not defined' | 'closed' | 'medium' | 'raised'
type CervixFirmness = 'not defined' | 'firm' | 'medium' | 'soft'
type CervixPosition = 'not defined' | 'low' | 'medium' | 'high'
type SexualActivityUsingContraceptive =
  | 'none'
  | 'condom'
  | 'female condom'
  | 'pill'
  | 'ring'
  | 'patch'
  | 'hormonal IUD'
  | 'copper IUD'
  | 'chemical'
  | 'diaphragm'
  | 'implant'
type SexualDesire = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type Pain =
  | 'not defined'
  | 'cramps'
  | 'ovulation pain'
  | 'headache'
  | 'backache'
  | 'nausea'
  | 'tender breasts'
  | 'migraine'
  | 'other'
type Mood =
  | 'not defined'
  | 'happy'
  | 'confident'
  | 'calm'
  | 'energetic'
  | 'excited'
  | 'PMS'
  | 'mood swings'
  | 'irritable'
  | 'anxious'
  | 'stressed'
  | 'tired'
  | 'sensitive'
  | 'numb'
  | 'sad'
  | 'angry'

interface DayData {
  temperature?: number
  excludeReason: ExcludeReasonValue
  bleeding: BleedingValue
  cervicalMucusFeeling: CervicalMucusFeeling
  cervicalMucusStructure: CervicalMucusStructure
  cervixOpening: CervixOpening
  cervixFirmness: CervixFirmness
  cervixPosition: CervixPosition
  sexActivity: SexualActivityUsingContraceptive[]
  sexDesire: SexualDesire
  pain: Pain
  mood: Mood
  ovulationTest: boolean
}

const PropertyHeadline = ({ children }: { children: React.ReactNode }) => (
  <Subheading>{children}</Subheading>
)

export default ({ onAdd }: { onAdd: (day: Day) => void }) => {
  const [state, setState] = useState<DayData>({
    temperature: undefined,
    excludeReason: 'not defined',
    bleeding: 'not defined',
    cervicalMucusFeeling: 'nothing',
    cervicalMucusStructure: 'nothing',
    cervixOpening: 'not defined',
    cervixFirmness: 'not defined',
    cervixPosition: 'not defined',
    sexActivity: new Array(),
    sexDesire: -1,
    pain: 'not defined',
    mood: 'not defined',
    ovulationTest: undefined,
  })

  const { excludeReason, bleeding, cervicalMucusFeeling } = state

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

  const setCervicalMucusFeeling = (
    newCervicalMucusFeeling: CervicalMucusFeeling,
  ) =>
    setState({
      ...state,
      cervicalMucusFeeling: newCervicalMucusFeeling,
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

      <PropertyHeadline>CervicalMucus</PropertyHeadline>

      <RadioButtonGroup
        value={cervicalMucusFeeling}
        onValueChange={(value) => {
          setCervicalMucusFeeling(value as CervicalMucusFeeling)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Dry',
            value: 'dry',
            icon: 'water',
          },
          {
            title: 'Wet',
            value: 'wet',
            icon: 'water',
          },
          {
            title: 'Slippery',
            value: 'slippery',
            icon: 'water',
          },
        ]}
      />

      <Button
        onPress={() => {
          onAdd({
            bleeding: {
              strength: 5,
            },
            cervical: undefined,
            cervix: undefined,
          })
        }}
        mode="contained"
        style={{ borderRadius: 30 }}>
        Add day
      </Button>
    </View>
  )
}
