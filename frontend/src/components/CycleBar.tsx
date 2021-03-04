import { Dimensions, Text, View } from 'react-native'
import Svg, { Rect, Text as SvgText } from 'react-native-svg'
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

  const periodBarWidth = width * (periodLength / maxCycleLength)
  const cycleBarWidth = width * (cycleLength / maxCycleLength)
  const barHeight = 20
  return (
    <View style={{ marginTop: 30 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flexGrow: 1 }}>{month}</Text>
        <Text>{cycleLength}d</Text>
      </View>
      <Svg width={width} height="20" viewBox={`0 0 ${width} 20`}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={barHeight}
          rx="5px"
          fill={colors.buttonBackground}
        />
        <Rect
          x={0}
          y={0}
          width={cycleBarWidth}
          height={barHeight}
          rx="5px"
          fill={colors.primary}
        />
        <Rect
          x={0}
          y={0}
          width={periodBarWidth}
          height={barHeight}
          rx="5px"
          fill={colors.periodRed}
        />
        <SvgText
          x={periodBarWidth / 2}
          y={barHeight / 2}
          textAnchor="middle"
          alignmentBaseline={'central'}
          fontSize={15}
          fill={'white'}>
          {periodLength}
        </SvgText>
      </Svg>
    </View>
  )
}
