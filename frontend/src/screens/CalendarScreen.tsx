import React from 'react'
import { Alert, View } from 'react-native'
import Calendar from '../components/Calendar'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import { Bleeding, Day } from '../../generated'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { DayIndex } from '../daysSlice'

type CalendarScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Calendar'>,
  StackNavigationProp<MainStackParamList>
>

export default ({
  navigation,
}: {
  navigation: CalendarScreenNavigationProp
}) => {
  const days = Object.values(
    useSelector<RootState, DayIndex>((state) => state.days.days),
  )

  return (
    <View>
      <Calendar
        periodDays={days.filter(
          (day) =>
            day.bleeding && day.bleeding.strength !== Bleeding.strength.NONE,
        )}
        onDaySelected={(day: Day) => {
          navigation.navigate('Detail', {
            day,
          })
        }}
      />
    </View>
  )
}
