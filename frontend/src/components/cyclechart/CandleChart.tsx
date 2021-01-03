import { Day } from '../../../generated'

import { format } from 'date-fns'
import React from 'react'
import Candle from './Candle'
import { Text } from 'react-native-svg'
import { scaleY } from './worklets'

const CORNER_TEMPERATURE = 36
export const CANDLE_MARGIN = 2

export const createCandleData = (
  days: Day[],
): [number | undefined, Day, number | undefined][] => {
  return days.map((day, index) => {
    if (index === days.length - 1) {
      return [day.temperature?.value, day, CORNER_TEMPERATURE]
    }

    if (index === 0) {
      return [CORNER_TEMPERATURE, day, days[index + 1].temperature?.value]
    }

    return [day.temperature?.value, day, days[index + 1].temperature?.value]
  })
}

type CandleChartProps = {
  days: Day[]
  viewHeight: number
}

export default ({ days, viewHeight }: CandleChartProps) => {
  if (days.length === 0) {
    return null
  }

  const temperatures = createCandleData(days)

  return (
    <>
      {temperatures.map(([dayStart, day, dayEnd], index) => {
        const width = 20
        const x = index * width + CANDLE_MARGIN
        return (
          <React.Fragment key={day.date}>
            {dayStart && dayEnd && (
              <Candle
                width={width}
                dayStart={dayStart}
                dayEnd={dayEnd}
                viewHeight={viewHeight}
                x={x}
              />
            )}
            <Text fill="black" x={x} y={scaleY(0, viewHeight)}>
              {format(new Date(day.date), 'dd')}
            </Text>
          </React.Fragment>
        )
      })}
    </>
  )
}
