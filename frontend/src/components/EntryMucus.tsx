import RadioButtonGroup from './RadioButtonGroup'
import { ExcludeReason, Mucus } from '../../generated'
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
        defaultValue={Mucus.feeling.NONE}
        onValueChange={onFeelingChanged}
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
        defaultValue={Mucus.texture.NONE}
        onValueChange={onTextureChanged}
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
