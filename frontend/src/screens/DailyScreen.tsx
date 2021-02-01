import React from 'react'
import { View, Text } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { Bleeding, Day } from '../../generated'
import { DayIndex } from '../daysSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { IPeriod } from '../../generated/protobuf'

type DailyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Daily'>,
  StackNavigationProp<MainStackParamList>
>

export default ({ navigation }: { navigation: DailyScreenNavigationProp }) => {
  const days = Object.values(
    useSelector<RootState, DayIndex>((state) => state.days.byDay), // FIXME dynamically load from state
  )

  const periodStats = Object.values(
    useSelector<RootState, IPeriod[]>((state) => state.days.periodStats),
  )

  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
        <View>
          <Text>{JSON.stringify(periodStats)}</Text>
        </View>
        <CalendarStrip
          periodDays={days.filter(
            (day) =>
              day.bleeding && day.bleeding.strength !== Bleeding.strength.NONE,
          )}
          onDateSelected={(date: string) => {}}
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
