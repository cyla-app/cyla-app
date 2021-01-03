import { useTheme } from 'react-native-paper'
import { Rect, Text } from 'react-native-svg'
import React from 'react'
import { scaleBody, scaleY } from './worklets'

const MARGIN = 2

export interface CandleProps {
  name: string
  dayStart: number
  dayEnd: number
  index: number
  width: number
}

export default ({ name, dayStart, dayEnd, index, width }: CandleProps) => {
  const { colors } = useTheme()
  const fill =
    dayEnd > dayStart ? colors.statisticsPositive : colors.statisticsNegative
  const x = index * width
  const max = Math.max(dayStart, dayEnd)
  const min = Math.min(dayStart, dayEnd)
  return (
    <>
      <Rect
        x={x + MARGIN}
        y={scaleY(max)}
        width={width - MARGIN * 2}
        height={scaleBody(max - min)}
        fill={fill}
      />
      <Text fill="black" x={x + MARGIN} y={scaleY(0)}>
        {name}
      </Text>
    </>
  )
}
