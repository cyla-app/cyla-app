import React from 'react'
import Svg, { Path, PathProps } from 'react-native-svg'
import Animated from 'react-native-reanimated'

// @ts-ignore
const AnimatedPath = Animated.createAnimatedComponent<never, PathProps>(Path)

export type SvgTabBarIconProps = {
  color: string
  size: number
  viewBox?: string
  children?: React.ReactNode
} & Animated.AnimateProps<{}, PathProps & { style?: any }>

export default ({
  color,
  size,
  children,
  viewBox,
  ...svgProps
}: SvgTabBarIconProps) => {
  return (
    <Svg width={size} height={size} viewBox={viewBox}>
      <AnimatedPath fill={color} {...svgProps} />
      {children}
    </Svg>
  )
}
