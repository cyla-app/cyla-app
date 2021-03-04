import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import React, { useEffect } from 'react'
import { DaysStateType, fetchDuration } from '../daysSlice'
import useLoadMore from '../hooks/useLoadMore'
import Chart from '../components/chart/Chart'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { RefreshControl, ScrollView, View } from 'react-native'
import useRefresh from '../hooks/useRefresh'
import { Button, Card, Headline } from 'react-native-paper'
import CycleBar from '../components/CycleBar'
import { format } from 'date-fns'
import { parseDay } from '../utils/date'
import { Period } from '../../generated/period-stats'
import { calculateCycleLengths, max } from '../utils/stats'
import CycleStats from '../components/CycleStats'

export default () => {
  const days = useSelector<RootState, DaysStateType>((state) => state.days)
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  const periodStats = useSelector<RootState, Period[]>(
    (state) => state.days.periodStats,
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, refresh] = useRefresh()
  const [loadingMore, loadMore] = useLoadMore()
  const dispatch = useDispatch()

  const cycleLengths = calculateCycleLengths(periodStats)
  const plainCycleLengths = cycleLengths.map(([cycleLength]) => cycleLength)
  const plainPeriodLengths = cycleLengths.map(
    ([_, periodLength]) => periodLength,
  )

  const maxCycleLength = cycleLengths.length > 0 ? max(plainCycleLengths) : 0

  useEffect(() => {
    dispatch(fetchDuration())
  }, [dispatch])

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          marginBottom: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }>
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            marginBottom: 20,
          }}>
          <CycleStats
            cycleLengths={plainCycleLengths}
            periodLengths={plainPeriodLengths}
          />
        </View>

        <Headline style={{ margin: 20 }}>Temperature</Headline>
        {Object.keys(days.byWeek).length !== 0 ? (
          <Chart
            weekIndex={days.byWeek}
            dayIndex={days.byDay}
            loadMore={loadMore}
            loading={loadingMore}
          />
        ) : (
          <Button
            onPress={() => {
              loadMore()
            }}>
            No days in the past months. Load more?
          </Button>
        )}

        <Card
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
            marginBottom: 10,
          }}>
          <View style={{ margin: 10 }}>
            <Headline>Cycles</Headline>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {cycleLengths.map(([cycleLength, periodLength, period1], i) => (
                <CycleBar
                  key={i}
                  month={format(parseDay(period1.to), 'MMMM')}
                  periodLength={periodLength}
                  cycleLength={cycleLength}
                  maxCycleLength={maxCycleLength}
                />
              ))}
            </View>
          </View>
        </Card>

        <DaysErrorSnackbar daysError={daysError} />
      </ScrollView>
    </>
  )
}
