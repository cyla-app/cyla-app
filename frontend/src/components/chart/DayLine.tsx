import { Day } from '../../types'
import { scaleY } from './worklets'
import { Circle, Line } from 'react-native-svg'
import React from 'react'
import { POINT_GAP } from './PointChart'
import { useTheme } from 'react-native-paper'

type PointLineProps = {
  day: Day
  nextDay?: Day
  viewHeight: number
  viewWidth: number
  x: number
  overwriteColor?: string
}

export default ({
  viewWidth,
  viewHeight,
  x,
  day,
  nextDay,
  overwriteColor,
}: PointLineProps) => {
  const { colors } = useTheme()
  if (!day.temperature) {
    return null
  }
  const y = scaleY(day.temperature.value, viewHeight)
  const nextDayTemperature = nextDay?.temperature
  return (
    <>
      {nextDayTemperature && (
        <Line
          x1={viewWidth - x}
          y1={y}
          x2={viewWidth - x - POINT_GAP}
          y2={scaleY(nextDayTemperature.value, viewHeight)}
          strokeWidth={1}
          stroke={overwriteColor ?? colors.primary}
        />
      )}
      <Circle
        r={4}
        cx={viewWidth - x}
        cy={y}
        fill={colors.background}
        stroke={colors.primary}
      />
    </>
  )
}
