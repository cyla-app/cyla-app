import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { RouteProp } from '@react-navigation/native'
import { Day, Period } from '../types'
import EntryDay from '../components/EntryDay'
import { DayIndex, saveDay } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { formatDay } from '../utils/date'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { Headline, IconButton } from 'react-native-paper'
import CalendarStrip from '../components/CalendarStrip'
import { format } from 'date-fns'
import { StackNavigationProp } from '@react-navigation/stack'

type AddScreenNavigationProp = StackNavigationProp<MainStackParamList>
type DetailScreenRouteProp = RouteProp<MainStackParamList, 'Add'>

export default ({
  navigation,
  route,
}: {
  route: DetailScreenRouteProp
  navigation: AddScreenNavigationProp
}) => {
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  const periodStats = useSelector<RootState, Period[]>(
    (state) => state.days.periodStats,
  )

  const [selectedDate, setSelectedDate] = useState(
    route.params.date ?? new Date(),
  )

  const dispatch = useDispatch()

  return (
    <>
      <View
        style={{
          flex: 1,
          alignContent: 'flex-end',
          marginBottom: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <IconButton
            icon="close"
            color={'black'}
            size={25}
            onPress={() => navigation.goBack()}
          />
        </View>
        <Headline style={{ textAlign: 'center', margin: 20 }}>
          {format(selectedDate, 'dd MMMM')}
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
          periodStats={periodStats}
          onDateSelected={(date: string) => {
            setSelectedDate(new Date(date))
          }}
        />
      </View>
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
