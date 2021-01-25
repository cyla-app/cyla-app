import {
  DayIndex,
  DAYS_IN_WEEK,
  WeekIndex,
  WeekIndexData,
} from '../../daysSlice'
import { FlatList } from 'react-native'
import React from 'react'
import PointChart, { POINT_GAP } from './PointChart'
import { ActivityIndicator } from 'react-native-paper'
import Svg from 'react-native-svg'
import Grid from './Grid'
import { formatDay } from '../../utils/date'
import { add, sub } from 'date-fns'

// Space below Grid
const bottomQuietZone = 15
const daysPerChart = DAYS_IN_WEEK
const viewWidth = POINT_GAP * daysPerChart

const LoadMoreSpinner = () => <ActivityIndicator size={'large'} />

const RenderItem = ({
  days,
  week,
}: {
  days: DayIndex
  week: WeekIndexData
}) => {
  const viewHeight = 300
  const daysInWeek = [...week.asList].reverse()
  const firstDay = new Date(daysInWeek[daysInWeek.length - 1].date)
  const lastDay = new Date(daysInWeek[0].date)
  return (
    <Svg width={viewWidth} height={viewHeight + bottomQuietZone}>
      <Grid viewHeight={viewHeight} viewWidth={viewWidth} />
      <PointChart
        previousDay={days[formatDay(sub(firstDay, { days: 1 }))]}
        nextDay={days[formatDay(add(lastDay, { days: 1 }))]}
        viewHeight={viewHeight}
        viewWidth={viewWidth}
        days={daysInWeek}
      />
    </Svg>
  )
}

export default ({
  weekIndex,
  dayIndex,
  loadMore,
}: {
  weekIndex: WeekIndex
  dayIndex: DayIndex
  loadMore: () => void
}) => {
  const data: WeekIndexData[] = Array.from(Object.values(weekIndex)).sort(
    (a, b) => {
      if (a.year === b.year) {
        return b.week - a.week
      }

      return b.year - a.year
    },
  )

  return (
    <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item: WeekIndexData) => `${item.year}-${item.week}`}
      inverted={true}
      maxToRenderPerBatch={6}
      initialNumToRender={4}
      getItemLayout={(_, index) => ({
        length: viewWidth,
        offset: viewWidth * index,
        index,
      })}
      onEndReached={loadMore}
      ListFooterComponentStyle={{
        flex: 1,
        margin: 10,
        justifyContent: 'center',
      }}
      ListFooterComponent={LoadMoreSpinner}
      renderItem={({ item }: { item: WeekIndexData }) => {
        return <RenderItem days={dayIndex} week={item} />
      }}
    />
  )
}
