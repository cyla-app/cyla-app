import { Button, Card, List } from 'react-native-paper'
import { StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { format } from 'date-fns'
import { RouteProp } from '@react-navigation/native'
import { parseDay } from '../utils/date'
import { StackNavigationProp } from '@react-navigation/stack'
import DayDetailList from '../components/DayDetailList'

type DetailScreenRouteProp = RouteProp<MainStackParamList, 'Detail'>

type PropType = {
  route: DetailScreenRouteProp
  navigation: StackNavigationProp<MainStackParamList>
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
          title={format(parseDay(day.date), 'd MMMM yyyy ')}
        />

        <DayDetailList day={day} />

        <Card.Content>
          <Button
            onPress={() => {
              navigation.navigate('Add', { date: new Date(day.date) })
            }}
            mode="outlined"
            style={{ borderRadius: 30, margin: 10, marginTop: 100 }}>
            Edit
          </Button>
        </Card.Content>
      </Card>
    </View>
  )
}
