import { Day } from '../../../generated'

import React from 'react'
import { Text } from 'react-native-svg'
import { format } from 'date-fns'
import DayLine from './DayLine'
import { parseDay } from '../../utils/date'

export const POINT_GAP = 20
const HORIZONTAL_SHIFT = POINT_GAP / 2

export const createPointData = (days: Day[]): [Day, Day?][] => {
  return days.map((day, index) => {
    if (index === days.length - 1) {
      return [day, undefined]
    }

    if (index === 0) {
      return [day, days[index + 1]]
    }

    return [day, days[index + 1]]
  })
}

type PointChartProps = {
  previousDay: Day | null
  days: Day[]
  nextDay: Day | null
  viewHeight: number
  viewWidth: number
}

export default ({
  previousDay,
  days,
  nextDay,
  viewHeight,
  viewWidth,
}: PointChartProps) => {
  if (days.length === 0) {
    return null
  }

  const temperatures = createPointData(days)
  return (
    <>
      {previousDay?.temperature && (
        <DayLine
          viewHeight={viewHeight}
          viewWidth={viewWidth}
          x={viewWidth - HORIZONTAL_SHIFT}
          day={days[days.length - 1]}
          color={'green'}
          nextDay={previousDay}
        />
      )}
      {temperatures.map(([day, nextDay], index) => {
        const x = index * POINT_GAP + POINT_GAP - HORIZONTAL_SHIFT
        return (
          <React.Fragment key={day.date}>
            {day.temperature && (
              <DayLine
                viewHeight={viewHeight}
                viewWidth={viewWidth}
                x={x}
                day={day}
                nextDay={nextDay}
              />
            )}
            <Text
              fill="black"
              x={viewWidth - x}
              y={viewHeight + 15}
              fontSize={10}
              textAnchor="middle">
              {format(parseDay(day.date), 'dd')}
            </Text>
          </React.Fragment>
        )
      })}
      {nextDay?.temperature && (
        <DayLine
          viewHeight={viewHeight}
          viewWidth={viewWidth}
          x={0 - HORIZONTAL_SHIFT}
          day={nextDay}
          color={'red'}
          nextDay={days[0]}
        />
      )}
    </>
  )
}
