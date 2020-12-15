import { View } from 'react-native'
import React, { useState } from 'react'
import RadioButtonGroup from './RadioButtonGroup'
import TemperatureEdit from './TemperatureEdit'
import { Button, Subheading } from 'react-native-paper'
import {
  Day,
  //Temperature,
  CervicalMucus,
  Cervix,
  Mood,
  OvulationTest,
  Pain,
  SexualActivity,
  SexualDesire,
} from '../../generated'

// import Slider from '@react-native-community/slider'

type ExcludeReasonValue = 'not defined' | 'sick' | 'sleep' | 'hungover'
type BleedingValue = 'not defined' | 'period' | 'spotting'

interface DayData {
  temperature?: number
  excludeReason: ExcludeReasonValue
  bleeding: BleedingValue
  cervicalMucus: CervicalMucus
  cervix: Cervix
  sexActivity: SexualActivity[]
  sexDesire: SexualDesire
  pain: Pain
  mood: Mood
  ovulationTest: OvulationTest
}

const PropertyHeadline = ({ children }: { children: React.ReactNode }) => (
  <Subheading>{children}</Subheading>
)

export default ({ onAdd }: { onAdd: (day: Day) => void }) => {
  const [state, setState] = useState<DayData>({
    temperature: undefined,
    excludeReason: 'not defined',
    bleeding: 'not defined',
    cervicalMucus: {
      feeling: CervicalMucus.feeling.NOTHING,
      texture: CervicalMucus.texture.NOTHING,
    },
    cervix: {
      opening: undefined,
      firmness: undefined,
      position: undefined,
    },
    sexActivity: new Array(),
    sexDesire: { intensity: undefined },
    pain: { type: undefined },
    mood: { type: undefined },
    ovulationTest: { result: undefined },
  })

  const { excludeReason, bleeding, cervix, cervicalMucus } = state

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

  /*const setCervixOpening = (newOpening: Cervix.opening) =>
    setState({
      ...state,
      cervix: {
        opening: newOpening,
        firmness: cervix.firmness,
        position: cervix.position,
      },
    })

  const setCervixFirmness = (newFirmness: Cervix.firmness) =>
    setState({
      ...state,
      cervix: {
        opening: cervix.opening,
        firmness: newFirmness,
        position: cervix.position,
      },
    })

  const setCervixPosition = (newPosition: Cervix.position) =>
    setState({
      ...state,
      cervix: {
        opening: cervix.opening,
        firmness: cervix.firmness,
        position: newPosition,
      },
    })

  const setCervicalMucusFeeling = (
    newCervicalMucusFeeling: CervicalMucus.feeling,
  ) =>
    setState({
      ...state,
      cervicalMucus: {
        feeling: newCervicalMucusFeeling,
        texture: cervicalMucus.texture,
      },
    })

  const setCervicalMucusTexture = (
    newCervicalMucusTexture: CervicalMucus.texture,
  ) =>
    setState({
      ...state,
      cervicalMucus: {
        feeling: cervicalMucus.feeling,
        texture: newCervicalMucusTexture,
      },
    })*/

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

      {/*<PropertyHeadline>Cervical Mucus</PropertyHeadline>

      <RadioButtonGroup
        value={cervix.opening}
        onValueChange={(value) => {
          setCervixOpening(value as Cervix.opening)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Closed',
            value: Cervix.opening.CLOSED,
            icon: 'water',
          },
          {
            title: 'Medium',
            value: Cervix.opening.MEDIUM,
            icon: 'water',
          },
          {
            title: 'Raised',
            value: Cervix.opening.RAISED,
            icon: 'water',
          },
        ]}
      />
      <RadioButtonGroup
        value={cervix.firmness}
        onValueChange={(value) => {
          setCervixFirmness(value as Cervix.firmness)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Firm',
            value: Cervix.firmness.FIRM,
            icon: 'water',
          },
          {
            title: 'Medium',
            value: Cervix.firmness.MEDIUM,
            icon: 'water',
          },
          {
            title: 'Soft',
            value: Cervix.firmness.SOFT,
            icon: 'water',
          },
        ]}
      />
      <RadioButtonGroup
        value={cervix.position}
        onValueChange={(value) => {
          setCervixPosition(value as Cervix.position)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Low',
            value: Cervix.position.LOW,
            icon: 'water',
          },
          {
            title: 'Medium',
            value: Cervix.position.MEDIUM,
            icon: 'water',
          },
          {
            title: 'High',
            value: Cervix.position.HIGH,
            icon: 'water',
          },
        ]}
      />

      <PropertyHeadline>Cervical Mucus</PropertyHeadline>

      <RadioButtonGroup
        value={cervicalMucus.feeling}
        onValueChange={(value) => {
          setCervicalMucusFeeling(value as CervicalMucus.feeling)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Dry',
            value: CervicalMucus.feeling.DRY,
            icon: 'water',
          },
          {
            title: 'Wet',
            value: CervicalMucus.feeling.WET,
            icon: 'water',
          },
          {
            title: 'Slippery',
            value: CervicalMucus.feeling.SLIPPERY,
            icon: 'water',
          },
        ]}
      />
      <RadioButtonGroup
        value={cervicalMucus.texture}
        onValueChange={(value) => {
          setCervicalMucusTexture(value as CervicalMucus.texture)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Creamy',
            value: CervicalMucus.texture.CREAMY,
            icon: 'water',
          },
          {
            title: 'Egg White',
            value: CervicalMucus.texture.EGG_WHITE,
            icon: 'water',
          },
        ]}
      />*/}

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
