import { List } from 'react-native-paper'
import {
  BleedingStrength,
  CervixFirmness,
  CervixOpening,
  CervixPosition,
  Day,
  MucusFeeling,
  MucusTexture,
} from '../types'
import React from 'react'

const mapCervixOpening = (opening: CervixOpening) => {
  return opening === CervixOpening.OPENING_RAISED
    ? 'Raised'
    : opening === CervixOpening.OPENING_MEDIUM
    ? 'Medium'
    : opening === CervixOpening.OPENING_CLOSED
    ? 'Closed'
    : ''
}
const mapCervixPosition = (position: CervixPosition) => {
  return position === CervixPosition.POSITION_LOW
    ? 'Low'
    : position === CervixPosition.POSITION_CENTER
    ? 'Center'
    : position === CervixPosition.POSITION_HIGH
    ? 'High'
    : ''
}
const mapCervixFirmness = (firmness: CervixFirmness) => {
  return firmness === CervixFirmness.FIRMNESS_SOFT
    ? 'Soft'
    : firmness === CervixFirmness.FIRMNESS_MEDIUM
    ? 'Medium'
    : firmness === CervixFirmness.FIRMNESS_FIRM
    ? 'Firm'
    : ''
}
const mapMucusTexture = (texture: MucusTexture) => {
  return texture === MucusTexture.TEXTURE_EGG_WHITE
    ? 'Egg White'
    : texture === MucusTexture.TEXTURE_CREAMY
    ? 'Creamy'
    : ''
}
const mapMucusFeeling = (feeling: MucusFeeling) => {
  return feeling === MucusFeeling.FEELING_WET
    ? 'Weg'
    : feeling === MucusFeeling.FEELING_SLIPPERY
    ? 'Slippery'
    : feeling === MucusFeeling.FEELING_DRY
    ? 'Dry'
    : ''
}
const mapBleedingStrength = (bleeding: BleedingStrength) => {
  return bleeding === BleedingStrength.STRENGTH_WEAK
    ? 'Weak'
    : bleeding === BleedingStrength.STRENGTH_MEDIUM
    ? 'Medium'
    : bleeding === BleedingStrength.STRENGTH_STRONG
    ? 'Strong'
    : ''
}

export default ({ day }: { day: Day }) => {
  const { temperature, bleeding, mucus, cervix } = day

  return (
    <>
      {temperature && (
        <List.Item
          title={`Temperature ${Math.round(temperature.value * 100) / 100}`}
          left={(props) => <List.Icon {...props} icon="thermometer" />}
        />
      )}
      {bleeding && Day.isBleeding(day) && (
        <List.Item
          title={`Bleeding: ${mapBleedingStrength(bleeding.strength)}`}
          left={(props) => <List.Icon {...props} icon="water" />}
        />
      )}
      {mucus &&
        mucus.texture !== MucusTexture.TEXTURE_NONE &&
        mucus.feeling !== MucusFeeling.FEELING_NONE && (
          <List.Item
            title={`Mucus: ${mapMucusFeeling(
              mucus.feeling,
            )} & ${mapMucusTexture(mucus.texture)}`}
            left={(props) => <List.Icon {...props} icon="waves" />}
          />
        )}
      {cervix && (
        <List.Item
          title={`Cervix ${mapCervixOpening(
            cervix.opening,
          )} & ${mapCervixFirmness(cervix.firmness)} &  ${mapCervixPosition(
            cervix.position,
          )}`}
          left={() => <List.Icon icon="waves" />}
        />
      )}
    </>
  )
}
