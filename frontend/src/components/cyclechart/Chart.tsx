import { Day } from '../../../generated'
import Svg from 'react-native-svg'
import { format } from 'date-fns'
import React from 'react'
import { SIZE } from './worklets'
import Candle from './Candle'
import Grid from './Grid'

export default ({ days }: { days: Day[] }) => {
  if (days.length === 0) {
    return null
  }

  const temperatures: [
    number | undefined,
    Day,
    number | undefined,
  ][] = days.map((day, index) => {
    let DEFAULT_TEMPERATURE = 36
    if (index === days.length - 1) {
      return [day.temperature?.value, day, DEFAULT_TEMPERATURE]
    }

    if (index === 0) {
      return [DEFAULT_TEMPERATURE, day, days[index + 1].temperature?.value]
    }

    return [day.temperature?.value, day, days[index + 1].temperature?.value]
  })

  console.log(temperatures)

  return (
    <Svg width={SIZE} height={SIZE}>
      <Grid />
      {temperatures.map(([dayStart, day, dayEnd], index) =>
        dayStart && dayEnd ? (
          <Candle
            name={format(new Date(day.date), 'dd')}
            key={day.date}
            width={SIZE / temperatures.length}
            dayStart={dayStart}
            dayEnd={dayEnd}
            index={index}
          />
        ) : null,
      )}
    </Svg>
  )
}
