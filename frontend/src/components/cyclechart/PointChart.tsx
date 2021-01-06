import { Day } from '../../../generated'

import React, { useMemo } from 'react'
import { scaleY } from './worklets'
import { Circle, Line } from 'react-native-svg'

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

type PointChartProps = {
  days: Day[]
  viewHeight: number
}

export default ({ days, viewHeight }: PointChartProps) => {
  if (days.length === 0) {
    return null
  }

  const temperatures = useMemo(() => createPointData(days), [days])

  return (
    <>
      {temperatures.map(([_, day, nextDay], index) => {
        if (!day.temperature) {
          return null
        }
        const width = 20
        const x = index * width
        const y = scaleY(day.temperature.value, viewHeight)
        return (
          <React.Fragment key={day.date}>
            <Circle r={4} cx={x} cy={y} fill="black" />
            {nextDay && (
              <Line
                key={day.date + 'line'}
                x1={x}
                y1={y}
                x2={x + width}
                y2={scaleY(nextDay, viewHeight)}
                strokeWidth={2}
                stroke={'black'}
              />
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}
