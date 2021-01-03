import React from 'react'
import SvgTabBarIcon, { SvgTabBarIconProps } from './SvgTabBarIcon'
import { Path, PathProps } from 'react-native-svg'
import Animated from 'react-native-reanimated'

const AnimatedPath = Animated.createAnimatedComponent<
  any,
  PathProps & { style?: undefined }
>(Path)

export default ({ color, size }: SvgTabBarIconProps) => {
  return (
    <SvgTabBarIcon
      color={color}
      size={size}
      viewBox="0 0 32 24"
      d="m22 2.25h-3.25v-1.5c-.014-.404-.344-.726-.75-.726s-.736.322-.75.725v.001 1.5h-4.5v-1.5c-.014-.404-.344-.726-.75-.726s-.736.322-.75.725v.001 1.5h-4.5v-1.5c-.014-.404-.344-.726-.75-.726s-.736.322-.75.725v.001 1.5h-3.25c-1.104 0-2 .895-2 1.999v17.75c0 1.105.895 2 2 2h20c1.105 0 2-.895 2-2v-17.75c0-1.104-.896-1.999-2-1.999zm.5 19.75c0 .276-.224.499-.499.5h-20.001c-.276 0-.5-.224-.5-.5v-17.75c.001-.276.224-.499.5-.499h3.25v1.5c.014.404.344.726.75.726s.736-.322.75-.725v-.001-1.5h4.5v1.5c.014.404.344.726.75.726s.736-.322.75-.725v-.001-1.5h4.5v1.5c.014.404.344.726.75.726s.736-.322.75-.725v-.001-1.5h3.25c.276 0 .499.224.499.499z"
      fill={color}>
      <AnimatedPath fill={color} d="m5.25 9h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m5.25 12.75h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m5.25 16.5h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m10.5 16.5h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m10.5 12.75h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m10.5 9h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m15.75 16.5h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m15.75 12.75h3v2.25h-3z" />
      <AnimatedPath fill={color} d="m15.75 9h3v2.25h-3z" />
    </SvgTabBarIcon>
  )
}
