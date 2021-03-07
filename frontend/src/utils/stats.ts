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
  const currentPeriod = periodStats[periodStats.length - 1]

  return (
    // +1, because we assume that the current day is always counted
    Math.max(differenceInDays(new Date(), parseDay(currentPeriod.from)), 0) + 1
  )
}

export const periodPercentageOfCurrentCycle = (
  cycleLengths: number[],
  periodStats: Period[],
) => {
  if (periodStats.length === 0 || cycleLengths.length === 0) {
    return 0
  }
  const cycleStats = stats(cycleLengths)
  const currentPeriod = periodStats[periodStats.length - 1]
  const periodDays = differenceInDays(
    parseDay(currentPeriod.to),
    parseDay(currentPeriod.from),
  )
  return periodDays / cycleStats.mean
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

export type CycleLengthType = [number, number, Period, Period]

export const calculateCycleLengths = (periodStats: Period[]) =>
  pairwise(periodStats).reduceRight<CycleLengthType[]>(
    (accumulator, [period1, period2]) => {
      accumulator.push([
        Math.abs(
          differenceInDays(parseDay(period2.from), parseDay(period1.to)),
        ),
        Math.abs(
          differenceInDays(parseDay(period1.to), parseDay(period1.from)),
        ),
        period1,
        period2,
      ])
      return accumulator
    },
    [],
  )
