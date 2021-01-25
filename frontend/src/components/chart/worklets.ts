import { Extrapolate, interpolate } from 'react-native-reanimated'

export const DOMAIN = [36, 38]

export const scaleY = (value: number, viewHeight: number) => {
  'worklet'
  return interpolate(value, DOMAIN, [viewHeight, 0], Extrapolate.CLAMP)
}

export const scaleBody = (value: number, viewHeight: number) => {
  'worklet'
  return interpolate(
    value,
    [0, Math.max(...DOMAIN) - Math.min(...DOMAIN)],
    [0, viewHeight],
    Extrapolate.CLAMP,
  )
}
