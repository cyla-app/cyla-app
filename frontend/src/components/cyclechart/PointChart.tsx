import { Day } from '../../../generated'

import React from 'react'
import { scaleY, SIZE } from './worklets'
import { Circle, Line } from 'react-native-svg'
import Candle from './Candle'
import { format } from 'date-fns'
import { createCandleData } from './CandleChart'

export const createPointData = (
  days: Day[],
): [number | undefined, Day, number | undefined][] => {
  return days.map((day, index) => {
    if (index === days.length - 1) {
      return [day.temperature?.value, day, undefined]
    }

    if (index === 0) {
      return [undefined, day, days[index + 1].temperature?.value]
    }

    return [day.temperature?.value, day, days[index + 1].temperature?.value]
  })
}

export default ({ days }: { days: Day[] }) => {
  if (days.length === 0) {
    return null
  }

  const temperatures = createCandleData(days)

  return (
    <>
      {temperatures.map(([_, day, nextDay], index) => {
        if (!day.temperature) {
          return null
        }
        const width = SIZE / days.length
        const x = index * width
        const y = day.temperature.value
        return (
          <>
            <Circle key={day.date} r={4} cx={x} cy={scaleY(y)} fill="black" />
            {nextDay && (
              <Line
                key={day.date + 'line'}
                x1={x}
                y1={scaleY(y)}
                x2={(index + 1) * width}
                y2={scaleY(nextDay)}
                strokeWidth={2}
                stroke={'black'}
              />
            )}
          </>
        )
      })}
    </>
  )
}
