import React, { useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { Bleeding, Day } from '../../generated'
import EntryDay from '../components/EntryDay'
import { DayIndex, saveDay } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { formatDay, parseDay } from '../utils/date'
import useRefresh from '../hooks/useRefresh'

type DailyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Daily'>,
  StackNavigationProp<MainStackParamList>
>

export default ({ navigation }: { navigation: DailyScreenNavigationProp }) => {
  const days = Object.values(
    useSelector<RootState, DayIndex>((state) => state.days.byDay), // FIXME dynamically load from state
  )
  const [loading, refresh] = useRefresh()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const dispatch = useDispatch()

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'flex-end',
      }}>
      <ScrollView
        contentContainerStyle={{}}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }>
        <EntryDay
          selectedDate={formatDay(selectedDate)}
          onSave={(day: Day) => {
            dispatch(saveDay(day))
          }}
        />
      </ScrollView>

      <View>
        <CalendarStrip
          periodDays={days.filter(
            (day) =>
              day.bleeding && day.bleeding.strength !== Bleeding.strength.NONE,
          )}
          onDateSelected={(date: string) => {
            setSelectedDate(parseDay(date))
          }}
          onDaySelected={(day: Day) => {
            navigation.navigate('Detail', {
              day,
            })
          }}
        />
      </View>
    </View>
  )
}
