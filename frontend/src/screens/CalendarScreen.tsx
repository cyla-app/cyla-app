import React, { useEffect } from 'react'
import { View } from 'react-native'
import Calendar from '../components/Calendar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../types'
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { DayIndex, fetchPeriodStats, fetchRange } from '../daysSlice'
import { lastDayOfMonth } from 'date-fns'
import { formatDay } from '../utils/date'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { Period } from '../types'

type CalendarScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Calendar'>,
  StackNavigationProp<MainStackParamList>
>

export default ({
  navigation,
}: {
  navigation: CalendarScreenNavigationProp
}) => {
  const periodStats = Object.values(
    useSelector<RootState, Period[]>((state) => state.days.periodStats),
  )
  const days = Object.values(
    useSelector<RootState, DayIndex>((state) => state.days.byDay),
  )
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPeriodStats())
  }, [dispatch])

  return (
    <>
      <View>
        <Calendar
          days={days}
          onVisibleMonthsChange={(months) => {
            const first = new Date(months[0].year, months[0].month - 1)
            const last = lastDayOfMonth(
              new Date(
                months[months.length - 1].year,
                months[months.length - 1].month - 1,
              ),
            )
            dispatch(
              fetchRange({
                from: formatDay(first),
                to: formatDay(last),
                refresh: false,
              }),
            )
          }}
          periodStats={periodStats}
          onDaySelected={(day: Day) => {
            navigation.navigate('Detail', {
              day,
            })
          }}
        />
      </View>
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
