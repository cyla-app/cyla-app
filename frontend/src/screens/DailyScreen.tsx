import React, { useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { Bleeding, Day } from '../../generated'
import { DayIndex, fetchPeriodStats } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { IPeriod } from '../../generated/protobuf'
import { add, differenceInDays, format } from 'date-fns'
import { parseDay } from '../utils/date'
import { max, stats } from '../utils/math'
import CycleBar from '../components/CycleBar'
import CycleStats from '../components/CycleStats'
import CycleCircle from '../components/CycleCircle'

type DailyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Daily'>,
  StackNavigationProp<MainStackParamList>
>

const pairwise = <T,>(array: T[]): [T, T][] => {
  const output: [T, T][] = []
  for (let i = 0; i < array.length - 1; i++) {
    output.push([array[i], array[i + 1]])
  }
  return output
}

const calculatePercentageUntilNextPeriod = (
  periodStats: IPeriod[],
  cycleLengths: number[],
): [number, number] => {
  if (periodStats.length === 0) {
    return [0, 0]
  }
  const lastPeriod = periodStats[periodStats.length - 1]
  const cycleStats = stats(cycleLengths)

  const daysSinceLastPeriod = differenceInDays(
    parseDay(lastPeriod.to!),
    new Date(),
  )
  return [daysSinceLastPeriod, daysSinceLastPeriod / cycleStats.mean]
}

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

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPeriodStats())
  }, [dispatch])

  const cycleLengths = pairwise(periodStats).reduceRight<
    [number, IPeriod, IPeriod][]
  >((accumulator, [period1, period2]) => {
    accumulator.push([
      Math.abs(
        differenceInDays(parseDay(period2.from!), parseDay(period1.to!)),
      ),
      period1,
      period2,
    ])
    return accumulator
  }, [])

  const plainCycleLengths = cycleLengths.map(([cycleLength]) => cycleLength)
  const maxCycleLength = cycleLengths.length > 0 ? max(plainCycleLengths) : 0

  const [cycleDay, percentage] = calculatePercentageUntilNextPeriod(
    periodStats,
    plainCycleLengths,
  )
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <CycleStats cycleLengths={plainCycleLengths} />
        <CycleCircle cycleDay={cycleDay} percentage={percentage} />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          {cycleLengths.map(([cycleLength, period1], i) => (
            <CycleBar
              key={i}
              month={format(parseDay(period1.to!), 'MMMM')}
              cycleLength={cycleLength}
              maxCycleLength={maxCycleLength}
            />
          ))}
        </ScrollView>
        <CalendarStrip
          periodDays={days.filter(
            (day) =>
              day.bleeding && day.bleeding.strength !== Bleeding.strength.NONE,
          )}
          onDateSelected={(_: string) => {}}
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
