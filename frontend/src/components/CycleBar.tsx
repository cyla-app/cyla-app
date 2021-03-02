import { Dimensions, Text, View } from 'react-native'
import Svg, { Rect } from 'react-native-svg'
import React from 'react'
import { useTheme } from 'react-native-paper'

export default ({
  month,
  maxCycleLength,
  cycleLength,
  periodLength,
}: {
  month: string
  cycleLength: number
  periodLength: number
  maxCycleLength: number
}) => {
  const { colors } = useTheme()
  const width = Dimensions.get('window').width * 0.8

  return (
    <View style={{ marginTop: 30 }}>
      <Text>{month}</Text>
      <Svg width={width} height="20" viewBox={`0 0 ${width} 20`}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={20}
          rx="5px"
          fill={colors.buttonBackground}
        />
        <Rect
          x={0}
          y={0}
          width={width * (cycleLength / maxCycleLength)}
          height={20}
          rx="5px"
          fill={colors.primary}
        />
        <Rect
          x={0}
          y={0}
          width={width * (periodLength / maxCycleLength)}
          height={20}
          rx="5px"
          fill={colors.periodRed}
        />
      </Svg>
    </View>
  )
}
