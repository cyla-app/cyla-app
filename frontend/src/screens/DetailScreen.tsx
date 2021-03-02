import { Button, Card, List } from 'react-native-paper'
import { StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { format } from 'date-fns'
import { RouteProp } from '@react-navigation/native'
import { parseDay } from '../utils/date'
import {
  BleedingStrength,
  CervixFirmness,
  CervixOpening,
  CervixPosition,
  Day,
  MucusFeeling,
  MucusTexture,
} from '../types'
import { Mucus_Feeling, Mucus_Texture } from '../../generated/day'
import { StackNavigationProp } from '@react-navigation/stack'

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

type DetailScreenRouteProp = RouteProp<MainStackParamList, 'Detail'>

type PropType = {
  route: DetailScreenRouteProp
  navigation: StackNavigationProp<MainStackParamList>
}

export default ({ route, navigation }: PropType) => {
  const { day } = route.params

  const { temperature, bleeding, mucus, cervix } = day

  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Card
        theme={{ roundness: 20 }}
        style={[StyleSheet.absoluteFill, { height: 1000 }]}>
        <Card.Title
          titleStyle={{ textAlign: 'center' }}
          title={format(parseDay(day.date), 'd MMMM yyyy ')}
        />

        <Card.Content>
          <List.Section>
            {temperature && (
              <List.Item
                title={`Temperature ${
                  Math.round(temperature.value * 100) / 100
                }`}
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
              mucus.texture !== Mucus_Texture.TEXTURE_NONE &&
              mucus.feeling !== Mucus_Feeling.FEELING_NONE && (
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
                )} & ${mapCervixFirmness(
                  cervix.firmness,
                )} &  ${mapCervixPosition(cervix.position)}`}
                left={() => <List.Icon icon="waves" />}
              />
            )}
          </List.Section>
          <Button
            onPress={() => {
              navigation.navigate('Add', { date: new Date(day.date) })
            }}
            mode="outlined"
            style={
              { borderRadius: 30, margin: 10, marginTop: 100 } as ViewStyle
            }>
            Edit
          </Button>
        </Card.Content>
      </Card>
    </View>
  )
}
