import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPeriod } from '../generated/protobuf'
import { Day } from '../generated'
import { parseDay } from './utils/date'
import { add, isAfter, isBefore, isWithinInterval, sub } from 'date-fns'

const findInsertIndex = (periods: IPeriod[], day: Day) => {
  const date = parseDay(day.date)

  let index = 0
  for (; index < periods.length; index++) {
    const period = periods[index]

    const start = parseDay(period.from!)
    const end = parseDay(period.to!)
    const range = {
      start: sub(start, { days: 1 }),
      end: add(end, { days: 1 }),
    }

    if (isWithinInterval(date, range)) {
      return { index, exists: true }
    } else {
      if (isAfter(date, end)) {
        return { index, exists: false }
      }
    }
  }
  return { index, exists: false }
}

type StatisticsStateType = {
  periods: IPeriod[]
}

const statistics = createSlice({
  name: 'statistics',
  initialState: {
    periods: [],
  } as StatisticsStateType,
  reducers: {
    markPeriod: (state, action: PayloadAction<Day>) => {
      const day = action.payload
      if (!day.bleeding) {
        return state
      }
      const { periods } = state
      const newPeriods = [...periods]
      const { index, exists } = findInsertIndex(periods, day)

      if (exists) {
        // merge into existing period
        const period = periods[index]
        newPeriods[index] = {
          from: isBefore(new Date(day.date), new Date(period.from!))
            ? day.date
            : period.from,
          to: isAfter(new Date(day.date), new Date(period.to!))
            ? day.date
            : period.to,
        }
      } else {
        // create new period and insert at correct position
        newPeriods.splice(index, 0, { from: day.date, to: day.date })
      }

      return {
        ...state,
        periods: newPeriods,
      }
    },
    unmarkPeriod: (state, action: PayloadAction<Day>) => {
      const day = action.payload
      if (day.bleeding) {
        return state
      }

      throw new Error('NYI')
    },
  },
})

export const markPeriod = statistics.actions.markPeriod
export const unmarkPeriod = statistics.actions.unmarkPeriod

export const reducer = statistics.reducer
