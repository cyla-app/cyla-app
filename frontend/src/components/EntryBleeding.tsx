import RadioButtonGroup, { TextIcon } from './RadioButtonGroup'
import { BleedingStrength } from '../types'
import React from 'react'

type PropsType = {
  strength: BleedingStrength
  onStrengthChanged: (strength: BleedingStrength) => void
}

export default ({ strength, onStrengthChanged }: PropsType) => {
  return (
    <RadioButtonGroup
      value={strength}
      defaultValue={BleedingStrength.STRENGTH_NONE}
      onValueChange={onStrengthChanged}
      buttons={[
        {
          title: 'Weak',
          value: BleedingStrength.STRENGTH_WEAK,
          icon: () => <TextIcon title={'Weak'} />,
        },
        {
          title: 'Medium',
          value: BleedingStrength.STRENGTH_MEDIUM,
          icon: () => <TextIcon title={'Medium'} />,
        },
        {
          title: 'Strong',
          value: BleedingStrength.STRENGTH_STRONG,
          icon: () => <TextIcon title={'Strong'} />,
        },
      ]}
    />
  )
}
