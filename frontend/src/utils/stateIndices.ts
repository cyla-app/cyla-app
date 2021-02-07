import { Day } from '../types'
import { DAYS_IN_WEEK, formatDay, parseDay } from './date'
import {
  add,
  getISODay,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
} from 'date-fns'
import { WeekIndex } from '../daysSlice'

export const groupByDay = (days: Day[]) =>
  Object.fromEntries(days.map((day) => [day.date, day]))

export const groupByWeeks = (dayList: Day[]) =>
  dayList.reduce((acc: WeekIndex, day) => {
    const date = parseDay(day.date)
    const week = getISOWeek(date)
    const year = getISOWeekYear(date)
    const key = `${year}-${week}`
    const weekday = getISODay(date) - 1
    let weekIndexData = acc[key]

    // Group initialization
    if (!weekIndexData) {
      const weekStart = startOfISOWeek(date)

      acc[key] = {
        year,
        week,
        index: {},
        asList: [...Array(DAYS_IN_WEEK).keys()].map((i) => ({
          volatile: true,
          date: formatDay(add(weekStart, { days: i })),
        })),
      }
    }

    // Grouping
    weekIndexData = acc[key]
    weekIndexData.index[day.date] = day
    weekIndexData.asList[weekday] = day
    return acc
  }, {})

export const mergeWeekIndices = (
  a: WeekIndex,
  override: WeekIndex,
): WeekIndex => {
  const copy: WeekIndex = { ...a }

  for (const [key, { week, year, asList, index }] of Object.entries(override)) {
    copy[key] = {
      week,
      year,
      asList: asList.map((day, i) =>
        copy[key] ? (day.volatile ? copy[key].asList[i] : day) : day,
      ),
      index: { ...(copy[key]?.index || {}), ...index },
    }
  }

  return copy
}
