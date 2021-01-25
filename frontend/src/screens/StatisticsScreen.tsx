import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import Grid from '../components/cyclechart/Grid'
import Svg from 'react-native-svg'
import PointChart, { POINT_GAP } from '../components/cyclechart/PointChart'
import React from 'react'
import {
  DayIndex,
  DAYS_IN_WEEK,
  DaysStateType,
  useLoadMore,
  WeekIndexData,
} from '../daysSlice'
import { format, sub, add } from 'date-fns'
import { ActivityIndicator } from 'react-native-paper'
import { formatDay } from '../utils/date'

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

export default () => {
  const days = useSelector<RootState, DaysStateType>((state) => state.days)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, loadMore] = useLoadMore()

  const data: WeekIndexData[] = Array.from(Object.values(days.byWeek)).sort(
    (a, b) => {
      if (a.year === b.year) {
        return b.week - a.week
      }

      return b.year - a.year
    },
  )

  return (
    <View>
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
          return <RenderItem days={days.byDay} week={item} />
        }}
      />
    </View>
  )
}
