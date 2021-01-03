import { Line } from 'react-native-svg'
import React from 'react'
import { scaleY } from './worklets'

export default () => {
  return (
    <>
      {[...Array(10).keys()].map((i) => {
        const y = i + 36
        return (
          <Line
            key={i}
            x1={0}
            x2={500}
            y1={scaleY(y)}
            y2={scaleY(y)}
            strokeWidth={1}
            stroke={'grey'}
          />
        )
      })}
    </>
  )
}
