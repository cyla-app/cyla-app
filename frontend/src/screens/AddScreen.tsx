import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { Day, Period } from '../types'
import EntryDay from '../components/EntryDay'
import { DayIndex, saveDay } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { formatDay } from '../utils/date'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { Headline } from 'react-native-paper'
import CalendarStrip from '../components/CalendarStrip'
import { format } from 'date-fns'

type AddScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Add'>,
  StackNavigationProp<MainStackParamList>
>

export default ({}: { navigation: AddScreenNavigationProp }) => {
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  const days = useSelector<RootState, DayIndex>((state) => state.days.byDay) // FIXME dynamically load from state
  const periodStats = useSelector<RootState, Period[]>(
    (state) => state.days.periodStats,
  )

  const [selectedDate, setSelectedDate] = useState(new Date())

  const dispatch = useDispatch()

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignContent: 'flex-end',
          marginBottom: 30,
        }}>
        <Headline style={{ textAlign: 'center' }}>
          {format(selectedDate, 'dd MMMM yyyy')}
        </Headline>
        <ScrollView contentContainerStyle={{}}>
          <EntryDay
            selectedDate={formatDay(selectedDate)}
            onSave={(day: Day) => {
              dispatch(saveDay(day))
            }}
          />
        </ScrollView>
      </View>
      <View style={{ marginBottom: 20 }}>
        <CalendarStrip
          days={days}
          periodStats={periodStats}
          onDateSelected={(date: string) => {
            setSelectedDate(new Date(date))
          }}
          onDaySelected={(_: Day) => {}}
        />
      </View>
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
