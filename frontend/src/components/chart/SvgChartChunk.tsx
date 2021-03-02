import { DayIndex, WeekIndexData } from '../../daysSlice'
import Svg from 'react-native-svg'
import Grid from './Grid'
import PointChart from './PointChart'
import { formatDay } from '../../utils/date'
import { add, sub } from 'date-fns'
import React from 'react'
import { BOTTOM_QUIET_ZONE, VIEW_HEIGHT, VIEW_WIDTH } from './constants'

const SvgChartChunk = ({
  days,
  week,
}: {
  days: DayIndex
  week: WeekIndexData
}) => {
  const daysInWeek = [...week.asList].reverse()
  const firstDay = new Date(daysInWeek[daysInWeek.length - 1].date)
  const lastDay = new Date(daysInWeek[0].date)
  return (
    <Svg width={VIEW_WIDTH} height={VIEW_HEIGHT + BOTTOM_QUIET_ZONE}>
      <Grid viewHeight={VIEW_HEIGHT} viewWidth={VIEW_WIDTH} />
      <PointChart
        previousDay={days[formatDay(sub(firstDay, { days: 1 }))]}
        nextDay={days[formatDay(add(lastDay, { days: 1 }))]}
        viewHeight={VIEW_HEIGHT}
        viewWidth={VIEW_WIDTH}
        days={daysInWeek}
      />
    </Svg>
  )
}

export default SvgChartChunk
