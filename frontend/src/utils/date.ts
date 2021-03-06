import { format, isAfter, isBefore } from 'date-fns'

export const DAYS_IN_WEEK = 7

export const formatDay = (date: Date) => format(date, 'yyyy-MM-dd')

export const parseDay = (string: string) => {
  if (string === '') {
    throw new Error('Can not parse empty string to a date')
  }
  return new Date(string)
}

/**
 * Checks whether range1 is within range2
 *
 * @param range1 which can be completely within range2 or not
 * @param range2 which can be completely contain range1 or not
 */
export const isWithin = (
  range1: { from: Date; to: Date },
  range2: { from: Date; to: Date },
) => {
  return isAfter(range1.from, range2.from) && isBefore(range1.to, range2.to)
}
