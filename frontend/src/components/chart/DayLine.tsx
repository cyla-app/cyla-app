import { Day } from '../../../generated'
import { scaleY } from './worklets'
import { Circle, Line } from 'react-native-svg'
import React from 'react'
import { POINT_GAP } from './PointChart'

type PointLineProps = {
  day: Day
  nextDay?: Day
  viewHeight: number
  viewWidth: number
  x: number
  color?: string
}

export default ({
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
          stroke={color}
        />
      )}
    </>
  )
}
