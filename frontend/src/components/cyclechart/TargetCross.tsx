import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import Svg, { Line } from 'react-native-svg'
import React from 'react'
import { SIZE } from './worklets'

interface TargetCrossProps {
  opacity: Animated.SharedValue<number>
  translateY: Animated.SharedValue<number>
  translateX: Animated.SharedValue<number>
}

// const AnimatedLine = Animated.createAnimatedComponent(Line)

export default ({ opacity, translateY, translateX }: TargetCrossProps) => {
  const horizontal = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const vertical = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }))

  // var animatedProps = useAnimatedProps(function () {
  //   return { text: text.value }
  // })

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, horizontal]}>
        <Svg style={StyleSheet.absoluteFill}>
          <Line
            x1={0}
            y1={0}
            x2={SIZE}
            y2={0}
            strokeWidth={2}
            stroke="#B5B6B7"
            strokeDasharray="6 6"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, vertical]}>
        <Svg style={StyleSheet.absoluteFill}>
          <Line
            x1={0}
            y1={0}
            x2={0}
            y2={SIZE}
            strokeWidth={2}
            stroke="#B5B6B7"
            strokeDasharray="6 6"
          />
        </Svg>
      </Animated.View>
    </>
  )
}
