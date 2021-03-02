import { Card, Subheading } from 'react-native-paper'
import { stats } from '../utils/stats'
import React from 'react'
import { View, Text, TextStyle } from 'react-native'

const valueStyle: TextStyle = {
  flex: 1,
  textAlign: 'center',
  textAlignVertical: 'center',
  fontSize: 18,
  fontWeight: 'bold',
}
const titleStyle: TextStyle = { textAlign: 'center' }
const cardStyle = { flexGrow: 1, flexBasis: 0, height: 80 }

export default ({
  cycleLengths,
  periodLengths,
}: {
  periodLengths: number[]
  cycleLengths: number[]
}) => {
  if (cycleLengths.length === 0) {
    return (
      <Subheading>Not enough data to display average cycle length</Subheading>
    )
  }

  const cycleStats = stats(cycleLengths)

  const avgCycleLength = Math.round(cycleStats.mean * 10) / 10
  const cycleLengthVariance = Math.round(cycleStats.variance * 10) / 10
  const periodStats = stats(periodLengths)
  const avgPeriodLength = Math.round(periodStats.mean * 10) / 10

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Card style={cardStyle}>
        <Text style={titleStyle}>Average Cycle:</Text>
        <Text style={valueStyle}>{avgCycleLength}d</Text>
      </Card>
      <Card
        style={[
          {
            marginLeft: 10,
            marginRight: 10,
          },
          cardStyle,
        ]}>
        <Text style={titleStyle}>Cycle Variance:</Text>
        <Text style={valueStyle}> {cycleLengthVariance}d</Text>
      </Card>
      <Card style={cardStyle}>
        <Text style={titleStyle}>Average Period:</Text>
        <Text style={valueStyle}>{avgPeriodLength}d</Text>
      </Card>
    </View>
  )
}
