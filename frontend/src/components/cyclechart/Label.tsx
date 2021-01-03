import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { ReText } from 'react-native-redash'
import React from 'react'
import { DOMAIN, SIZE } from './worklets'

interface LabelProps {
  translateY: Animated.SharedValue<number>
  translateX: Animated.SharedValue<number>
  opacity: Animated.SharedValue<number>
}

export default ({ translateY, opacity }: LabelProps) => {
  const text = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [SIZE, 0],
      DOMAIN,
      Extrapolate.CLAMP,
    ).toFixed(2)
  })

  const vertical = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))
  return (
    <Animated.View
      style={[
        {
          width: 50,
          alignSelf: 'flex-end',
          backgroundColor: '#FEFFFF',
          borderRadius: 4,
          padding: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        vertical,
      ]}>
      <ReText text={text} />
    </Animated.View>
  )
}
