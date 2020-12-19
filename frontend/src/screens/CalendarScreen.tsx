import React from 'react'
import { Alert, View } from 'react-native'
import Calendar from '../components/Calendar'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../../generated'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'

type CalendarScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Calendar'>,
  StackNavigationProp<MainStackParamList>
>

export default ({
  navigation,
}: {
  navigation: CalendarScreenNavigationProp
}) => {
  const days = useSelector<RootState, Day[]>((state) => state.days.days)

  return (
    <View>
      <Calendar
        periodDays={days.map((day) => day.date)}
        onDayPress={(dateString) => {
          const found = days.find((day) => day.date === dateString)

          if (!found) {
            Alert.alert('Day not found!')
            return
          }

          navigation.navigate('Detail', {
            day: found,
          })
        }}
      />
    </View>
  )
}
