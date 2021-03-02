import { DayIndex, WeekIndex, WeekIndexData } from '../../daysSlice'
import { FlatList } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
import SvgChartChunk from './SvgChartChunk'
import { VIEW_WIDTH } from './constants'

const LoadMoreSpinner = () => <ActivityIndicator size={'large'} />

const sortedWeeks = (weekIndex: WeekIndex) =>
  Array.from(Object.values(weekIndex)).sort((a, b) => {
    if (a.year === b.year) {
      return b.week - a.week
    }

    return b.year - a.year
  })

type PropsType = {
  weekIndex: WeekIndex
  dayIndex: DayIndex
  loading: boolean
  loadMore: () => void
}

export default ({ weekIndex, dayIndex, loadMore, loading }: PropsType) => {
  const data: WeekIndexData[] = sortedWeeks(weekIndex)

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
        length: VIEW_WIDTH,
        offset: VIEW_WIDTH * index,
        index,
      })}
      onEndReached={loadMore}
      ListFooterComponentStyle={{
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        display: loading ? 'flex' : 'none',
      }}
      ListFooterComponent={LoadMoreSpinner}
      renderItem={({ item }: { item: WeekIndexData }) => {
        return <SvgChartChunk days={dayIndex} week={item} />
      }}
    />
  )
}
