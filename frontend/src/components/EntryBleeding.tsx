import RadioButtonGroup from './RadioButtonGroup'
import { Bleeding } from '../../generated'
import React from 'react'

type PropsType = {
  strength: Bleeding.strength
  onStrengthChanged: (strength: Bleeding.strength) => void
}

export default ({ strength, onStrengthChanged }: PropsType) => {
  return (
    <RadioButtonGroup
      value={strength}
      onValueChange={(value) => {
        onStrengthChanged(value)
      }}
      buttons={[
        {
          title: 'Weak',
          value: Bleeding.strength.WEAK,
          icon: 'water',
        },
        {
          title: 'Medium',
          value: Bleeding.strength.MEDIUM,
          icon: 'water',
        },
        {
          title: 'Strong',
          value: Bleeding.strength.STRONG,
          icon: 'water',
        },
      ]}
    />
  )
}
