import React, { useEffect } from 'react'
import { View, Text, Dimensions, ScrollView } from 'react-native'
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
import { differenceInDays, format } from 'date-fns'
import { parseDay } from '../utils/date'
import { max, stats } from '../utils/math'
import Svg, { Rect } from 'react-native-svg'
import { Subheading, useTheme } from 'react-native-paper'

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

export default ({ navigation }: { navigation: DailyScreenNavigationProp }) => {
  const { colors } = useTheme()
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

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <View>
            {cycleLengths.length > 0 ? (
              <Subheading>
                Average Cycle Length:{' '}
                {Math.round(
                  stats(cycleLengths.map(([length]) => length)).mean * 10,
                ) / 10}{' '}
                (+/-
                {Math.round(
                  stats(cycleLengths.map(([length]) => length)).variance * 10,
                ) / 10}
                )
              </Subheading>
            ) : (
              <Subheading>Unknown</Subheading>
            )}
          </View>
          {cycleLengths.map(([length, period1], i) => {
            const width = Dimensions.get('window').width * 0.8
            const month = format(parseDay(period1.to!), 'MMMM')
            return (
              <View key={i} style={{ marginTop: 30 }}>
                <Text>{month}</Text>
                <Svg width={width} height="20" viewBox={`0 0 ${width} 20`}>
                  <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={20}
                    rx="5px"
                    fill={colors.buttonBackground}
                  />
                  <Rect
                    x={0}
                    y={0}
                    width={
                      width *
                      (length / max(cycleLengths.map(([length]) => length)))
                    }
                    height={20}
                    rx="5px"
                    fill={colors.primary}
                  />
                </Svg>
              </View>
            )
          })}
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
