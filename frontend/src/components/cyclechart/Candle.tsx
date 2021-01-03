import { useTheme } from 'react-native-paper'
import { Rect } from 'react-native-svg'
import React from 'react'
import { scaleBody, scaleY } from './worklets'
import { CANDLE_MARGIN } from './CandleChart'

interface CandleProps {
  dayStart: number
  dayEnd: number
  x: number
  width: number
  viewHeight: number
}

export default ({ dayStart, dayEnd, x, width, viewHeight }: CandleProps) => {
  const { colors } = useTheme()
  const fill =
    dayEnd > dayStart ? colors.statisticsPositive : colors.statisticsNegative
  const max = Math.max(dayStart, dayEnd)
  const min = Math.min(dayStart, dayEnd)
  return (
    <>
      <Rect
        x={x}
        y={scaleY(max, viewHeight)}
        width={width - CANDLE_MARGIN * 2}
        height={scaleBody(max - min, viewHeight)}
        fill={fill}
      />
    </>
  )
}
