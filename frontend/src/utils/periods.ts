import { IPeriod } from '../../generated/protobuf'
import { Bleeding, Day } from '../../generated'
import { formatDay, parseDay } from './date'
import {
  add,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  sub,
} from 'date-fns'

const findIndex = (
  periods: IPeriod[],
  day: Day,
  includeCloseProximity: boolean = false,
) => {
  const date = parseDay(day.date)
  let index = 0
  for (; index < periods.length; index++) {
    const period = periods[index]

    const start = parseDay(period.from!)
    const end = parseDay(period.to!)
    const range = {
      start: includeCloseProximity ? sub(start, { days: 1 }) : start,
      end: includeCloseProximity ? add(end, { days: 1 }) : end,
    }

    if (isWithinInterval(date, range)) {
      return { index, exists: true }
    } else if (isBefore(date, start)) {
      return { index: index, exists: false }
    }
  }
  return { index, exists: false }
}

const unionPeriods = (periods: IPeriod[]) => {
  if (periods.length < 2) {
    return periods
  }
  const newPeriods = []

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i]

    if (i === periods.length - 1) {
      // Reached the last one, no possibility to merge
      newPeriods.push(period)
      continue
    }

    const nextPeriod = periods[i + 1]
    if (
      isSameDay(
        add(parseDay(period.to!), { days: 1 }),
        parseDay(nextPeriod.from!),
      )
    ) {
      newPeriods.push({
        from: period.from,
        to: nextPeriod.to,
      })
      i++ // Skip next one as we unioned the current and the next
    } else {
      newPeriods.push(period)
    }
  }

  return newPeriods
}

export const markPeriod = (periods: IPeriod[], day: Day) => {
  if (!day.bleeding || day.bleeding.strength === Bleeding.strength.NONE) {
    return unmarkPeriod(periods, day)
  }

  const newPeriods = [...periods]
  const { index, exists } = findIndex(periods, day, true)

  if (exists) {
    // merge into existing period
    const period = periods[index]
    const dayDate = parseDay(day.date)
    newPeriods[index] = {
      from: isBefore(dayDate, new Date(period.from!)) ? day.date : period.from,
      to: isAfter(dayDate, new Date(period.to!)) ? day.date : period.to,
    }
  } else {
    // create new period and insert at correct position
    newPeriods.splice(index, 0, { from: day.date, to: day.date })
  }

  return unionPeriods(newPeriods)
}

const unmarkPeriod = (periods: IPeriod[], day: Day) => {
  if (day.bleeding && day.bleeding.strength !== Bleeding.strength.NONE) {
    return periods
  }

  const newPeriods = [...periods]
  const { index, exists } = findIndex(periods, day, false)

  if (!exists) {
    return periods
  }

  const dayDate = parseDay(day.date)
  const period = periods[index]

  if (isSameDay(dayDate, parseDay(period.from!))) {
    newPeriods[index] = {
      from: formatDay(add(dayDate, { days: 1 })),
      to: period.to,
    }
  } else if (isSameDay(dayDate, parseDay(period.to!))) {
    newPeriods[index] = {
      from: period.from,
      to: formatDay(sub(dayDate, { days: 1 })),
    }
  } else {
    newPeriods[index] = {
      from: formatDay(add(dayDate, { days: 1 })),
      to: period.to,
    }
    newPeriods.splice(index, 0, {
      from: period.from,
      to: formatDay(sub(dayDate, { days: 1 })),
    })
  }

  return newPeriods
}
