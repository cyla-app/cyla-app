import RadioButtonGroup from './RadioButtonGroup'
import { ExcludeReason } from '../types'
import React from 'react'

type PropsType = {
  excludeReason: ExcludeReason
  onExcludeReasonChanged: (excludeReason: ExcludeReason) => void
}

export default ({ excludeReason, onExcludeReasonChanged }: PropsType) => {
  return (
    <RadioButtonGroup
      value={excludeReason}
      defaultValue={ExcludeReason.EXCLUDE_REASON_NONE}
      onValueChange={(value) => onExcludeReasonChanged(value as ExcludeReason)}
      buttons={[
        {
          title: 'Sick',
          value: ExcludeReason.EXCLUDE_REASON_SICK,
          icon: 'virus',
        },
        {
          title: 'Hungover',
          value: ExcludeReason.EXCLUDE_REASON_HUNGOVER,
          icon: 'glass-cocktail',
        },
        {
          title: 'Sleep',
          value: ExcludeReason.EXCLUDE_REASON_SLEEP,
          icon: 'sleep',
        },
      ]}
    />
  )
}
