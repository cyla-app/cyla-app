import RadioButtonGroup from './RadioButtonGroup'
import { Cervix, CervixOpening, CervixPosition, CervixFirmness } from '../types'
import React from 'react'

type PropsType = {
  opening: CervixOpening
  onOpeningChanged: (feeling: CervixOpening) => void
  firmness: CervixFirmness
  onFirmnessChanged: (texture: CervixFirmness) => void
  position: CervixPosition
  onPositionChanged: (texture: CervixPosition) => void
}

export default ({
  opening,
  onOpeningChanged,
  firmness,
  onFirmnessChanged,
  position,
  onPositionChanged,
}: PropsType) => {
  return (
    <>
      <RadioButtonGroup
        value={opening}
        defaultValue={CervixOpening.OPENING_NONE}
        onValueChange={(value) => onOpeningChanged(value)}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Closed',
            value: CervixOpening.OPENING_CLOSED,
            icon: 'water',
          },
          {
            title: 'Medium',
            value: CervixOpening.OPENING_MEDIUM,
            icon: 'water',
          },
          {
            title: 'Raised',
            value: CervixOpening.OPENING_RAISED,
            icon: 'water',
          },
        ]}
      />
      <RadioButtonGroup
        value={firmness}
        defaultValue={CervixFirmness.FIRMNESS_NONE}
        onValueChange={(value) => onFirmnessChanged(value)}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Firm',
            value: CervixFirmness.FIRMNESS_FIRM,
            icon: 'water',
          },
          {
            title: 'Medium',
            value: CervixFirmness.FIRMNESS_MEDIUM,
            icon: 'water',
          },
          {
            title: 'Soft',
            value: CervixFirmness.FIRMNESS_SOFT,
            icon: 'water',
          },
        ]}
      />
      <RadioButtonGroup
        value={position}
        defaultValue={CervixPosition.POSITION_NONE}
        onValueChange={(value) => onPositionChanged(value)}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Low',
            value: CervixPosition.POSITION_LOW,
            icon: 'water',
          },
          {
            title: 'Medium',
            value: CervixPosition.POSITION_CENTER,
            icon: 'water',
          },
          {
            title: 'High',
            value: CervixPosition.POSITION_HIGH,
            icon: 'water',
          },
        ]}
      />
    </>
  )
}
