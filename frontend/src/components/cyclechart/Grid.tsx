import { Line } from 'react-native-svg'
import React from 'react'
import { scaleY } from './worklets'

const GRID_START = 36
const GRID_STOP = 38
const GRID_STEPS = 0.1

type GridProps = {
  viewWidth: number
  viewHeight: number
}

export default ({ viewWidth, viewHeight }: GridProps) => {
  return (
    <>
      {[...Array((GRID_STOP - GRID_START) / GRID_STEPS).keys()].map((i) => {
        const y = i * GRID_STEPS + GRID_START
        return (
          <Line
            key={i}
            x1={0}
            x2={viewWidth}
            y1={scaleY(y, viewHeight)}
            y2={scaleY(y, viewHeight)}
            strokeWidth={1}
            stroke={'gray'}
          />
        )
      })}
    </>
  )
}
