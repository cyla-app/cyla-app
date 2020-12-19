import RadioButtonGroup from './RadioButtonGroup'
import { Bleeding, Cervix } from '../../generated'
import React from 'react'

type PropsType = {
  opening: Cervix.opening
  onOpeningChanged: (feeling: Cervix.opening) => void
  firmness: Cervix.firmness
  onFirmnessChanged: (texture: Cervix.firmness) => void
  position: Cervix.position
  onPositionChanged: (texture: Cervix.position) => void
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
        defaultValue={Cervix.opening.NONE}
        onValueChange={(value) => onOpeningChanged(value)}
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
        value={firmness}
        defaultValue={Cervix.firmness.NONE}
        onValueChange={(value) => onFirmnessChanged(value)}
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
        value={position}
        defaultValue={Cervix.position.NONE}
        onValueChange={(value) => onPositionChanged(value)}
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
    </>
  )
}
