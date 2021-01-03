import Animated, { useAnimatedProps } from 'react-native-reanimated'
import { Line, LineProps } from 'react-native-svg'
import React from 'react'
import { SIZE } from './worklets'

interface TargetCrossProps {
  opacity: Animated.SharedValue<number>
  translateY: Animated.SharedValue<number>
  translateX: Animated.SharedValue<number>
}

const AnimatedLine = Animated.createAnimatedComponent<
  {},
  LineProps & { style?: null }
>(Line)

export default ({ opacity, translateY, translateX }: TargetCrossProps) => {
  const horizontal = useAnimatedProps(() => ({
    y1: translateY.value,
    y2: translateY.value,
    opacity: opacity.value,
  }))
  const vertical = useAnimatedProps(() => ({
    x1: translateX.value,
    x2: translateX.value,
    opacity: opacity.value,
  }))

  return (
    <>
      <AnimatedLine
        animatedProps={horizontal}
        x1={0}
        x2={SIZE}
        strokeWidth={2}
        stroke="#B5B6B7"
        strokeDasharray="6 6"
      />

      <AnimatedLine
        animatedProps={vertical}
        y1={0}
        y2={SIZE}
        strokeWidth={2}
        stroke="#B5B6B7"
        strokeDasharray="6 6"
      />
    </>
  )
}
