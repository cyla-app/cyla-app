import RadioButtonGroup from './RadioButtonGroup'
import { ExcludeReason } from '../../generated'
import React from 'react'

type PropsType = {
  excludeReason: ExcludeReason
  onExcludeReasonChanged: (excludeReason: ExcludeReason) => void
}

export default ({ excludeReason, onExcludeReasonChanged }: PropsType) => {
  return (
    <RadioButtonGroup
      value={excludeReason}
      defaultValue={ExcludeReason.NONE}
      onValueChange={(value) => onExcludeReasonChanged(value as ExcludeReason)}
      buttons={[
        {
          title: 'Sick',
          value: ExcludeReason.SICK,
          icon: 'virus',
        },
        {
          title: 'Hungover',
          value: ExcludeReason.HUNGOVER,
          icon: 'glass-cocktail',
        },
        {
          title: 'Sleep',
          value: ExcludeReason.SLEEP,
          icon: 'sleep',
        },
      ]}
    />
  )
}
