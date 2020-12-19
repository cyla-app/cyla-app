import { Card, List } from 'react-native-paper'
import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { format } from 'date-fns'
import { RouteProp } from '@react-navigation/native'

type DetailScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Detail'
>

type DetailScreenRouteProp = RouteProp<MainStackParamList, 'Detail'>

type PropType = {
  route: DetailScreenRouteProp
  navigation: DetailScreenNavigationProp
}

export default ({ route, navigation }: PropType) => {
  const { day } = route.params

  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Card
        theme={{ roundness: 20 }}
        style={[StyleSheet.absoluteFill, { height: 1000 }]}>
        <Card.Title
          titleStyle={{ textAlign: 'center' }}
          title={format(new Date(day.date), 'd MMMM yyyy ')}
        />

        <Card.Content>
          <List.Section>
            {day.temperature && (
              <List.Item
                title="Temperature"
                left={() => <List.Icon icon="thermometer" />}
                right={() => <Text>{day.temperature!.value}</Text>}
              />
            )}
            {day.bleeding && (
              <List.Item
                title="Bleeding"
                left={() => <List.Icon icon="water" />}
                right={() => <Text>{day.bleeding!.strength}</Text>}
              />
            )}
            {day.mucus && (
              <List.Item
                title="Mucus"
                left={() => <List.Icon icon="waves" />}
                right={() => (
                  <Text>
                    {day.mucus?.feeling} & {day.mucus!.texture}
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
