import { Day } from '../../../generated'

import React from 'react'
import { scaleY } from './worklets'
import { Circle, Line, Text } from 'react-native-svg'
import { format } from 'date-fns'

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

type PointLineProps = {
  day: Day
  nextDay?: Day
  viewHeight: number
  viewWidth: number
  x: number
  color?: string
}

const PointLine = ({
  viewWidth,
  viewHeight,
  x,
  day,
  nextDay,
  color = 'black',
}: PointLineProps) => {
  if (!day.temperature) {
    return null
  }
  const y = scaleY(day.temperature.value, viewHeight)
  const nextDayTemperature = nextDay?.temperature
  return (
    <>
      <Circle r={4} cx={viewWidth - x} cy={y} fill={color} />
      {nextDayTemperature && (
        <Line
          x1={viewWidth - x}
          y1={y}
          x2={viewWidth - x - POINT_GAP}
          y2={scaleY(nextDayTemperature.value, viewHeight)}
          strokeWidth={1}
          stroke={'black'}
        />
      )}
    </>
  )
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
        <PointLine
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
              <PointLine
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
              {format(new Date(day.date), 'dd')}
            </Text>
          </React.Fragment>
        )
      })}
      {nextDay?.temperature && (
        <PointLine
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
