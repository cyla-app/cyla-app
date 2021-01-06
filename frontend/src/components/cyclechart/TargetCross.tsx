import Animated, { useAnimatedProps } from 'react-native-reanimated'
import { Line, LineProps } from 'react-native-svg'
import React from 'react'

interface TargetCrossProps {
  opacity: Animated.SharedValue<number>
  translateY: Animated.SharedValue<number>
  translateX: Animated.SharedValue<number>
  viewWidth: number
}

// @ts-ignore
const AnimatedLine = Animated.createAnimatedComponent<never, LineProps>(Line)

export default ({
  opacity,
  translateY,
  translateX,
  viewWidth,
}: TargetCrossProps) => {
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
        // @ts-ignore
        animatedProps={horizontal}
        x1={0}
        x2={viewWidth}
        strokeWidth={2}
        stroke="#B5B6B7"
        strokeDasharray="6 6"
      />

      <AnimatedLine
        // @ts-ignore
        animatedProps={vertical}
        y1={0}
        y2={viewWidth}
        strokeWidth={2}
        stroke="#B5B6B7"
        strokeDasharray="6 6"
      />
    </>
  )
}
