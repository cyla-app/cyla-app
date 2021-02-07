import RadioButtonGroup from './RadioButtonGroup'
import { MucusTexture, MucusFeeling } from '../types'
import React from 'react'

type PropsType = {
  feeling: MucusFeeling
  onFeelingChanged: (feeling: MucusFeeling) => void
  texture: MucusTexture
  onTextureChanged: (texture: MucusTexture) => void
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
        defaultValue={MucusFeeling.FEELING_NONE}
        onValueChange={onFeelingChanged}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Dry',
            value: MucusFeeling.FEELING_DRY,
            icon: 'hair-dryer',
          },
          {
            title: 'Slippery',
            value: MucusFeeling.FEELING_SLIPPERY,
            icon: 'wave',
          },
          {
            title: 'Wet',
            value: MucusFeeling.FEELING_WET,
            icon: 'waves',
          },
        ]}
      />
      <RadioButtonGroup
        value={texture}
        defaultValue={MucusTexture.TEXTURE_NONE}
        onValueChange={onTextureChanged}
        buttons={[
          {
            title: 'Creamy',
            value: MucusTexture.TEXTURE_CREAMY,
            icon: 'ice-cream',
          },
          {
            title: 'Egg White',
            value: MucusTexture.TEXTURE_EGG_WHITE,
            icon: 'egg',
          },
        ]}
      />
    </>
  )
}
