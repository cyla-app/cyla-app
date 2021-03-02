import React, { useEffect } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { fetchPeriodStats } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { Period } from '../types'
import CycleCircle from '../components/CycleCircle'
import useRefresh from '../hooks/useRefresh'
import { Card, Headline, Subheading } from 'react-native-paper'
import { calculateCycleLengths, dayOfCurrentCycle } from '../utils/stats'

type DailyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Daily'>,
  StackNavigationProp<MainStackParamList>
>

export default ({}: { navigation: DailyScreenNavigationProp }) => {
  const periodStats = useSelector<RootState, Period[]>(
    (state) => state.days.periodStats,
  )

  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )

  const dispatch = useDispatch()

  const [loading, refresh] = useRefresh()

  useEffect(() => {
    dispatch(fetchPeriodStats())
  }, [dispatch])

  const cycleLengths = calculateCycleLengths(periodStats)

  const cycleDay = dayOfCurrentCycle(periodStats)

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          marginBottom: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }>
        <Card
          style={{
            margin: 20,
          }}>
          <View style={{ padding: 10 }}>
            <Headline>Hello!</Headline>
            <Subheading>
              Today is your {cycleDay !== null ? cycleDay : ''}. cycle day
            </Subheading>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{ margin: 10 }}>
                <CycleCircle
                  cycleDay={cycleDay}
                  periodStats={periodStats}
                  cycleLengths={cycleLengths}
                />
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
      <View style={{ marginBottom: 25 }} />
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
