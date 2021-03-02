import { Day } from '../../types'

import React from 'react'
import { Path, Text } from 'react-native-svg'
import { format } from 'date-fns'
import DayLine from './DayLine'
import { parseDay } from '../../utils/date'
import { HORIZONTAL_SHIFT, POINT_GAP } from './constants'

const DROP_WIDTH = 30

const createPointData = (days: Day[]): [Day, Day?][] => {
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
          //overwriteColor={'green'}
          nextDay={previousDay}
        />
      )}
      {nextDay?.temperature && (
        <DayLine
          viewHeight={viewHeight}
          viewWidth={viewWidth}
          x={0 - HORIZONTAL_SHIFT}
          day={nextDay}
          //overwriteColor={'red'}
          nextDay={days[0]}
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
            {/*            <Path
              fill="black"
              x={viewWidth - x + DROP_WIDTH / 2}
              y={0}
              transform="scale(0.5 0.5)"
              d="M12 3.571c3.658 5.437 6 9.223 6 12.503 0 3.268-2.691 5.926-6 5.926s-6-2.658-6-5.925c0-3.281 2.341-7.067 6-12.504zm0-3.571c-4.87 7.197-8 11.699-8 16.075 0 4.378 3.579 7.925 8 7.925s8-3.547 8-7.925c0-4.376-3.13-8.878-8-16.075z"
            />*/}
          </React.Fragment>
        )
      })}
    </>
  )
}
