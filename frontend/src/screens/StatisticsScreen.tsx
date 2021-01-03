import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '../App'
import { Day } from '../../generated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import TargetCross from '../components/cyclechart/TargetCross'
import Label from '../components/cyclechart/Label'
import Grid from '../components/cyclechart/Grid'
import Svg from 'react-native-svg'
import { SIZE } from '../components/cyclechart/worklets'

import CandleChart from '../components/cyclechart/CandleChart'

export default () => {
  const days = useSelector<RootState, Day[]>((state) => state.days.days)

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(0)
  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({ x, y }) => {
      opacity.value = 1
      translateY.value = y
      translateX.value = x
    },
    onEnd: () => {
      opacity.value = 0
    },
  })

  return (
    <View>
      <Svg width={SIZE} height={SIZE}>
        <Grid />
        <CandleChart days={days.slice(-14)} />
      </Svg>

      <PanGestureHandler minDist={0} {...{ onGestureEvent }}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <TargetCross
            opacity={opacity}
            translateX={translateX}
            translateY={translateY}
          />
          <Label opacity={opacity} translateY={translateY} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}
