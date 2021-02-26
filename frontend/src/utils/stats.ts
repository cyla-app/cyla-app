import { Period } from '../../generated/period-stats'
import { differenceInDays } from 'date-fns'
import { parseDay } from './date'
import { PeriodStats } from '../types'

const mean = (array: number[]): number =>
  array.reduce((p, c) => p + c, 0) / array.length

export const stats = (array: number[]) => {
  let avg = mean(array)
  const variance =
    array.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b) /
    array.length
  return { mean: avg, variance }
}

export const max = (array: number[]) =>
  array.reduce(function (a, b) {
    return Math.max(a, b)
  })

export const min = (array: number[]) =>
  array.reduce(function (a, b) {
    return Math.min(a, b)
  })

const pairwise = <T>(array: T[]): [T, T][] => {
  const output: [T, T][] = []
  for (let i = 0; i < array.length - 1; i++) {
    output.push([array[i], array[i + 1]])
  }
  return output
}

export const dayOfCurrentCycle = (periodStats: Period[]) => {
  if (periodStats.length === 0) {
    return null
  }
  const lastPeriod = periodStats[periodStats.length - 1]

  return Math.max(differenceInDays(new Date(), parseDay(lastPeriod.from)), 0)
}

export const percentageUntilNextPeriod = (
  cycleDay: number,
  cycleLengths: number[],
): number => {
  if (cycleLengths.length === 0) {
    return 0
  }
  const cycleStats = stats(cycleLengths)
  return Math.min(cycleDay / cycleStats.mean, 1)
}

export const calculateCycleLengths = (periodStats: Period[]) =>
  pairwise(periodStats).reduceRight<[number, Period, Period][]>(
    (accumulator, [period1, period2]) => {
      accumulator.push([
        Math.abs(
          differenceInDays(parseDay(period2.from), parseDay(period1.to)),
        ),
        period1,
        period2,
      ])
      return accumulator
    },
    [],
  )
