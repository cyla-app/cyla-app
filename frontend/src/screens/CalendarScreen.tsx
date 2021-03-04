import React, { useEffect, useState } from 'react'
import { View, ViewStyle } from 'react-native'
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
import { format, lastDayOfMonth } from 'date-fns'
import { formatDay, parseDay } from '../utils/date'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { Period } from '../types'
import { useCallback, useMemo, useRef } from 'react'
import { Text, StyleSheet } from 'react-native'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { Card, Headline, Button } from 'react-native-paper'
import DayDetailList from '../components/DayDetailList'

type CalendarScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Calendar'>,
  StackNavigationProp<MainStackParamList>
>

const snapPoints = ['25%', '50%', '75%']

export default ({
  navigation,
}: {
  navigation: CalendarScreenNavigationProp
}) => {
  const periodStats = useSelector<RootState, Period[]>(
    (state) => state.days.periodStats,
  )

  const days = useSelector<RootState, DayIndex>((state) => state.days.byDay)

  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )

  const [selectedDay, setSelectedDay] = useState<Day | null>(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPeriodStats())
  }, [dispatch])

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <>
      <BottomSheetModalProvider>
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
            setSelectedDay(day)
            handlePresentModalPress()
          }}
        />

        {/* @ts-ignore https://github.com/gorhom/react-native-bottom-sheet/issues/280 */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}>
          {selectedDay && (
            <View
              style={{
                flex: 1,
                margin: 10,
              }}>
              <Headline style={{ textAlign: 'center' }}>
                {format(parseDay(selectedDay.date), 'd MMMM yyyy ')}
              </Headline>

              <DayDetailList day={selectedDay} />

              <View
                style={{
                  alignItems: 'center',
                }}>
                <Button
                  onPress={() => {
                    navigation.navigate('Add', {
                      date: new Date(selectedDay.date),
                    })
                  }}
                  mode="outlined"
                  style={{ borderRadius: 30, width: 100, margin: 10 }}>
                  Edit
                </Button>
              </View>
            </View>
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
