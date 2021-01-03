import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated'
import { ReText } from 'react-native-redash'
import React from 'react'

interface LabelProps {
  translateY: Animated.SharedValue<number>
  opacity: Animated.SharedValue<number>
}

export default ({ translateY, opacity }: LabelProps) => {
  const text = useDerivedValue(() => {
    return String(Math.round(translateY.value))
  })

  const horizontal = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))
  return (
    <Animated.View
      style={[
        {
          width: 100,
          alignSelf: 'flex-end',
          backgroundColor: '#FEFFFF',
          borderRadius: 4,
          padding: 4,
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        horizontal,
      ]}>
      <ReText {...{ text }} />
    </Animated.View>
  )
}
