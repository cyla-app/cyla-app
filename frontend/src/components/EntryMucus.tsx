import RadioButtonGroup from './RadioButtonGroup'
import { Mucus } from '../../generated'
import React from 'react'

type PropsType = {
  feeling: Mucus.feeling
  onFeelingChanged: (feeling: Mucus.feeling) => void
  texture: Mucus.texture
  onTextureChanged: (texture: Mucus.texture) => void
}

export default ({
  feeling,
  onFeelingChanged,
  texture,
  onTextureChanged,
}: PropsType) => {
  return (
    <>
      <RadioButtonGroup
        value={feeling}
        onValueChange={(value: Mucus.feeling) => {
          onFeelingChanged(value)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Dry',
            value: Mucus.feeling.DRY,
            icon: 'water',
          },
          {
            title: 'Wet',
            value: Mucus.feeling.WET,
            icon: 'water',
          },
          {
            title: 'Slippery',
            value: Mucus.feeling.SLIPPERY,
            icon: 'water',
          },
        ]}
      />
      <RadioButtonGroup
        value={texture}
        onValueChange={(value) => {
          onTextureChanged(value)
        }}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Creamy',
            value: Mucus.texture.CREAMY,
            icon: 'water',
          },
          {
            title: 'Egg White',
            value: Mucus.texture.EGG_WHITE,
            icon: 'water',
          },
        ]}
      />
    </>
  )
}
