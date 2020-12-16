import { Card } from 'react-native-paper'
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

export default ({
  route,
  navigation,
}: {
  route: DetailScreenRouteProp
  navigation: DetailScreenNavigationProp
}) => {
  const { day } = route.params

  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Card
        theme={{ roundness: 20 }}
        style={[StyleSheet.absoluteFill, { height: 1000 }]}>
        <Card.Title
          titleStyle={{ textAlign: 'center' }}
          title={format(new Date(), 'Mo MMMM yyyy ')}
        />

        <Card.Content>
          <Text>{day.date}</Text>
        </Card.Content>
      </Card>
    </View>
  )
}
