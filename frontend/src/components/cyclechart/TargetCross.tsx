import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { Line } from 'react-native-svg'
import React from 'react'
import { SIZE } from './worklets'

interface TargetCrossProps {
  opacity: Animated.SharedValue<number>
  translateY: Animated.SharedValue<number>
  translateX: Animated.SharedValue<number>
}

export default ({ opacity, translateY, translateX }: TargetCrossProps) => {
  const horizontal = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const vertical = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, horizontal]}>
        <Line x={SIZE} y={0} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, vertical]}>
        <Line x={0} y={SIZE} />
      </Animated.View>
    </>
  )
}
