import Svg, { Path, Text } from 'react-native-svg'
import React from 'react'
import { useTheme } from 'react-native-paper'
import { Dimensions } from 'react-native'
import {
  CycleLengthType,
  percentageUntilNextPeriod,
  periodPercentageOfCurrentCycle,
} from '../utils/stats'
import { Period } from '../../generated/period-stats'

const circlePosition = (
  angleInDegree: number,
  centerX: number,
  centerY: number,
  radius: number,
) => {
  const angleInRadians = ((angleInDegree - 90) * Math.PI) / 180.0

  return [
    centerX + radius * Math.cos(angleInRadians),
    centerY + radius * Math.sin(angleInRadians),
  ]
}

export default ({
  periodStats,
  cycleDay,
  cycleLengths,
}: {
  periodStats: Period[]
  cycleLengths: CycleLengthType[]
  cycleDay?: number | null
}) => {
  const { colors } = useTheme()

  const plainCycleLengths = cycleLengths.map(([cycleLength]) => cycleLength)
  const percentage = percentageUntilNextPeriod(cycleDay ?? 0, plainCycleLengths)
  const periodPercentage = periodPercentageOfCurrentCycle(
    plainCycleLengths,
    periodStats,
  )

  const width = Dimensions.get('window').width * 0.65
  const radius = 50
  const centerX = 50
  const centerY = 50
  const fullDegrees = 330

  const [xFull, yFull] = circlePosition(fullDegrees, centerX, centerY, radius)

  const ongoingDegrees = percentage * fullDegrees
  const [xOngoing, yOngoing] = circlePosition(
    ongoingDegrees,
    centerX,
    centerY,
    radius,
  )

  const periodDegrees = periodPercentage * fullDegrees
  const [xPeriodDegrees, yPeriodDegrees] = circlePosition(
    periodDegrees,
    centerX,
    centerY,
    radius,
  )

  const stroke = 10
  const arrowSize = 10
  return (
    <Svg
      width={width}
      height={width}
      viewBox={`-${stroke / 2} -${stroke / 2} ${radius * 2 + stroke} ${
        radius * 2 + stroke
      }`}>
      {/* Circle Background */}
      <Path
        d={`M50,0
        A50,50 0 1,1 ${xFull} ${yFull}
        `}
        strokeWidth={stroke}
        stroke={colors.buttonBackground}
      />

      {/* Cycle Progress */}
      <Path
        d={`M50,0
        A50,50 0 ${ongoingDegrees > 180 ? '1' : '0'},1 ${xOngoing} ${yOngoing}
        `}
        strokeWidth={stroke}
        stroke={colors.primary}
      />
      {/* Period Progress */}
      <Path
        d={`M50,0
        A50,50 0 ${
          periodDegrees > 180 ? '1' : '0'
        },1 ${xPeriodDegrees} ${yPeriodDegrees}
        `}
        strokeWidth={stroke}
        stroke={colors.periodRed}
      />
      {/* Arrow */}
      <Path
        d={`M 50,-${stroke / 2 + arrowSize / 2} 
                l ${arrowSize}, ${arrowSize} -${arrowSize}, ${arrowSize} z
        `}
        fill={percentage >= 1 ? colors.primary : colors.buttonBackground}
        transform={`rotate(${fullDegrees} 50 50)`}
      />
    </Svg>
  )
}
