import { Button, Card } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import DayDataEntry from '../components/DayDataEntry'
import { format } from 'date-fns'

type AddScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Add'>

export default ({ navigation }: { navigation: AddScreenNavigationProp }) => {
  console.log(navigation)
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
          <DayDataEntry
            onAdd={(day) => {
              console.log(day)
            }}
          />

          <Button
            onPress={() => {}}
            mode="contained"
            style={{ borderRadius: 30 }}>
            Add
          </Button>
        </Card.Content>
      </Card>
    </View>
  )
}
