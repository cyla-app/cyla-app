import { View, FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../../generated'
import Grid from '../components/cyclechart/Grid'
import Svg from 'react-native-svg'
import PointChart, { POINT_GAP } from '../components/cyclechart/PointChart'
import { add, format, sub } from 'date-fns'
import React from 'react'
import { DaysStateType, WeekIndex, WeekIndexData } from '../daysSlice'

const fillEmptyDataPoints = (
  allDays: Day[],
  numberOfDays: number,
  initialDate = new Date(),
) => {
  const days: Day[] = []
  const currentData = Object.fromEntries(allDays.map((day) => [day.date, day]))

  for (let i = 0; i < numberOfDays; i++) {
    const date = sub(initialDate, { days: i })
    const dateString = format(date, 'yyyy-MM-dd')
    const day = currentData[dateString]
    const emptyDay = { date: dateString }
    days.push(day ? day : emptyDay)
  }

  return {
    previousDay:
      currentData[
        format(sub(initialDate, { days: numberOfDays }), 'yyyy-MM-dd')
      ],
    days,
    nextDay: currentData[format(add(initialDate, { days: 1 }), 'yyyy-MM-dd')],
  }
}

// Space below Grid
const bottomQuietZone = 15
const daysPerChart = 20
const viewWidth = POINT_GAP * daysPerChart

const RenderItem = React.memo(({ week }: { week: WeekIndexData }) => {
  const viewHeight = 300

  return (
    <Svg width={viewWidth} height={viewHeight + bottomQuietZone}>
      <Grid viewHeight={viewHeight} viewWidth={viewWidth} />
      <PointChart
        previousDay={null} // FIXME
        nextDay={null} // FIXME
        viewHeight={viewHeight}
        viewWidth={viewWidth}
        days={week.asList}
      />
    </Svg>
  )
})

export default () => {
  const days = useSelector<RootState, DaysStateType>((state) => state.days)

  const data: WeekIndexData[] = Array.from(Object.values(days.byWeek))
  return (
    <View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item: WeekIndexData) => String(item.week)}
        inverted={true}
        maxToRenderPerBatch={2}
        initialNumToRender={1}
        getItemLayout={(_, index) => ({
          length: viewWidth,
          offset: viewWidth * index,
          index,
        })}
        renderItem={({ item }: { item: WeekIndexData }) => {
          return <RenderItem week={item} />
        }}
      />
    </View>
  )
}
