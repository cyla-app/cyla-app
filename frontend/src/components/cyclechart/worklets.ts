import { Extrapolate, interpolate } from 'react-native-reanimated'
import { Dimensions } from 'react-native'

export const { width: SIZE } = Dimensions.get('window')
export const DOMAIN = [36, 40]

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
