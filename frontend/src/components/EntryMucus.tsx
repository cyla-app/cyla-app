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
            icon: 'hair-dryer',
          },
          {
            title: 'Slippery',
            value: Mucus.feeling.SLIPPERY,
            icon: 'wave',
          },
          {
            title: 'Wet',
            value: Mucus.feeling.WET,
            icon: 'waves',
          },
        ]}
      />
      <RadioButtonGroup
        value={texture}
        onValueChange={(value) => {
          onTextureChanged(value)
        }}
        buttons={[
          {
            title: 'Creamy',
            value: Mucus.texture.CREAMY,
            icon: 'ice-cream',
          },
          {
            title: 'Egg White',
            value: Mucus.texture.EGG_WHITE,
            icon: 'egg',
          },
        ]}
      />
    </>
  )
}
