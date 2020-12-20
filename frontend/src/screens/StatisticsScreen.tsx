import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import { View } from 'react-native'
import { Dimensions } from 'react-native'
import { interpolate, Extrapolate } from 'react-native-reanimated'
import { round } from 'react-native-redash'
import Svg, { Line, Rect } from 'react-native-svg'
import data from './date.json'
export const CANDLES = data.slice(0, 20) as Candle[]

export const { width: SIZE } = Dimensions.get('window')
export const STEP = SIZE / CANDLES.length

const getDomain = (rows: Candle[]): [number, number] => {
  'worklet'
  const values = rows.map(({ high, low }) => [high, low]).flat()
  return [Math.min(...values), Math.max(...values)]
}

export const DOMAIN = getDomain(CANDLES)

export const scaleY = (value: number) => {
  'worklet'
  return interpolate(value, DOMAIN, [SIZE, 0], Extrapolate.CLAMP)
}

export const scaleBody = (value: number) => {
  'worklet'
  return interpolate(
    value,
    [0, Math.max(...DOMAIN) - Math.min(...DOMAIN)],
    [0, SIZE],
    Extrapolate.CLAMP,
  )
}

const MARGIN = 2

export interface Candle {
  date: string
  day: number
  open: number
  high: number
  low: number
  close: number
}

interface CandleProps {
  candle: Candle
  index: number
  width: number
}

const Candle = ({ candle, index, width }: CandleProps) => {
  const { close, open, high, low } = candle
  const fill = close > open ? '#4AFA9A' : '#E33F64'
  const x = index * width
  const max = Math.max(open, close)
  const min = Math.min(open, close)
  return (
    <>
      <Line
        x1={x + width / 2}
        y1={scaleY(low)}
        x2={x + width / 2}
        y2={scaleY(high)}
        stroke={fill}
        strokeWidth={1}
      />
      <Rect
        x={x + MARGIN}
        y={scaleY(max)}
        width={width - MARGIN * 2}
        height={scaleBody(max - min)}
        {...{ fill }}
      />
    </>
  )
}

const Chart = () => (
  <Svg width={SIZE} height={SIZE}>
    {CANDLES.map((candle, index) => (
      <Candle key={candle.date} width={STEP} {...{ candle, index }} />
    ))}
  </Svg>
)

export default () => {
  return (
    <View>
      <Chart />
    </View>
  )
}
