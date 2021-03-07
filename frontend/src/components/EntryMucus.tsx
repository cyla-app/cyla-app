import RadioButtonGroup, { TextIcon } from './RadioButtonGroup'
import { MucusTexture, MucusFeeling } from '../types'
import React from 'react'
import { Headline, Subheading } from 'react-native-paper'
import { PropertyHeadline } from './EntryDay'

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
      <PropertyHeadline>Mucus Feeling</PropertyHeadline>
      <RadioButtonGroup
        value={feeling}
        defaultValue={MucusFeeling.FEELING_NONE}
        onValueChange={onFeelingChanged}
        // TODO pick fitting icons
        buttons={[
          {
            title: 'Dry',
            value: MucusFeeling.FEELING_DRY,
            icon: () => <TextIcon title={'Dry'} />,
          },
          {
            title: 'Slippery',
            value: MucusFeeling.FEELING_SLIPPERY,
            icon: () => <TextIcon title={'Slippery'} />,
          },
          {
            title: 'Wet',
            value: MucusFeeling.FEELING_WET,
            icon: () => <TextIcon title={'Wet'} />,
          },
        ]}
      />
      <PropertyHeadline>Mucus Texture</PropertyHeadline>
      <RadioButtonGroup
        value={texture}
        defaultValue={MucusTexture.TEXTURE_NONE}
        onValueChange={onTextureChanged}
        buttons={[
          {
            title: 'Creamy',
            value: MucusTexture.TEXTURE_CREAMY,
            icon: () => <TextIcon title={'Creamy'} />,
          },
          {
            title: 'Egg White',
            value: MucusTexture.TEXTURE_EGG_WHITE,
            icon: () => <TextIcon title={'Egg White'} />,
          },
        ]}
      />
    </>
  )
}
