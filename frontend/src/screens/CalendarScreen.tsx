import React from 'react'
import { View } from 'react-native'
import Calendar from '../components/Calendar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../../generated'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { DayIndex, fetchRange } from '../daysSlice'
import { lastDayOfMonth } from 'date-fns'

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
    useSelector<RootState, DayIndex>((state) => state.days.byDay), // FIXME dynamically load from state
  )
  const dispatch = useDispatch()

  return (
    <View>
      <Calendar
        onVisibleMonthsChange={(months) => {
          const first = new Date(months[0].year, months[0].month - 1)
          const last = lastDayOfMonth(
            new Date(
              months[months.length - 1].year,
              months[months.length - 1].month - 1,
            ),
          )
          dispatch(fetchRange({ from: first, to: last, refresh: false }))
        }}
        days={days}
        onDaySelected={(day: Day) => {
          navigation.navigate('Detail', {
            day,
          })
        }}
      />
    </View>
  )
}
