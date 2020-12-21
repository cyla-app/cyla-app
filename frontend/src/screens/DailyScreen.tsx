import React, { useState } from 'react'
import { Alert, RefreshControl, ScrollView, View } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import CylaModule from '../modules/CylaModule'
import { Bleeding, Day } from '../../generated'
import EntryDay from '../components/EntryDay'
import { useTheme } from 'react-native-paper'
import { fetchAllDays, useRefresh } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { format } from 'date-fns'

type DailyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Daily'>,
  StackNavigationProp<MainStackParamList>
>

export default ({ navigation }: { navigation: DailyScreenNavigationProp }) => {
  const days = useSelector<RootState, Day[]>((state) => state.days.days)
  const [loading, refresh] = useRefresh()
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd'),
  )

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
          selectedDate={selectedDate}
          onSave={async (day: Day) => {
            await CylaModule.postDay(
              new Date(selectedDate),
              day,
            ).catch((e: Error) => Alert.alert(e.message))
            await dispatch(fetchAllDays()) // FIXME probably not the best idea to fetch all data after adding
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
            setSelectedDate(date)
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
