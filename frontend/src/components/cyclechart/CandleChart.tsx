import { Day } from '../../../generated'

import { format } from 'date-fns'
import React from 'react'
import { SIZE } from './worklets'
import Candle from './Candle'

const CORNER_TEMPERATURE = 36

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

export default ({ days }: { days: Day[] }) => {
  if (days.length === 0) {
    return null
  }

  const temperatures = createCandleData(days)

  return (
    <>
      {temperatures.map(([dayStart, day, dayEnd], index) =>
        dayStart && dayEnd ? (
          <Candle
            key={day.date}
            name={format(new Date(day.date), 'dd')}
            width={SIZE / temperatures.length}
            dayStart={dayStart}
            dayEnd={dayEnd}
            index={index}
          />
        ) : null,
      )}
    </>
  )
}
