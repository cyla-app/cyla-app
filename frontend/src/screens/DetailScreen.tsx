import { Card, List } from 'react-native-paper'
import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { format } from 'date-fns'
import { RouteProp } from '@react-navigation/native'
import { parseDay } from '../utils/date'
import { BleedingStrength, Day, MucusFeeling, MucusTexture } from '../types'

type DetailScreenRouteProp = RouteProp<MainStackParamList, 'Detail'>

type PropType = {
  route: DetailScreenRouteProp
}

export default ({ route }: PropType) => {
  const { day } = route.params

  const temperature = day.temperature
  const bleeding = day.bleeding
  const mucus = day.mucus
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
                title="Temperature"
                left={() => <List.Icon icon="thermometer" />}
                right={() => (
                  <Text>{Math.round(temperature.value * 100) / 100}</Text>
                )}
              />
            )}
            {bleeding && Day.isBleeding(day) && (
              <List.Item
                title="Bleeding"
                left={() => <List.Icon icon="water" />}
                right={() => {
                  return <Text>{BleedingStrength[bleeding.strength]}</Text>
                }}
              />
            )}
            {mucus && (
              <List.Item
                title="Mucus"
                left={() => <List.Icon icon="waves" />}
                right={() => (
                  <Text>
                    {MucusFeeling[mucus.feeling]} &{' '}
                    {MucusTexture[mucus.texture]}
                  </Text>
                )}
              />
            )}
          </List.Section>
        </Card.Content>
      </Card>
    </View>
  )
}
