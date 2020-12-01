import { Button, Card } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'

type AddScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Add'>

export default ({ navigation }: { navigation: AddScreenNavigationProp }) => {
  console.log(navigation)
  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Card style={[StyleSheet.absoluteFill]}>
        <Card.Title
          title="Add data for today"
          subtitle={new Date().toDateString()}
        />
        <Card.Content>
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
