import React from 'react'
import SvgTabBarIcon, { SvgTabBarIconProps } from './SvgTabBarIcon'

export default ({ color, size }: SvgTabBarIconProps) => {
  return (
    <SvgTabBarIcon
      color={color}
      size={size}
      viewBox="0 0 32 24"
      d="m32 22v2h-32v-24h2v22zm-6-16 4 14h-26v-9l7-9 9 9z"
      fill={color}
    />
  )
}
