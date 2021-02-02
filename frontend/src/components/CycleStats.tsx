import { Subheading } from 'react-native-paper'
import { stats } from '../utils/math'
import React from 'react'

export default ({ cycleLengths }: { cycleLengths: number[] }) => {
  if (cycleLengths.length === 0) {
    return (
      <Subheading>Not enough data to display average cycle length</Subheading>
    )
  }

  const cycleStats = stats(cycleLengths)

  return (
    <Subheading>
      Average Cycle Length: {Math.round(cycleStats.mean * 10) / 10} (+/-
      {Math.round(cycleStats.variance * 10) / 10})
    </Subheading>
  )
}
