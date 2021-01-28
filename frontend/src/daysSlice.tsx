import {
  AnyAction,
  createAction,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { RootState } from './App'
import { add, isAfter, isBefore, isWithinInterval, sub } from 'date-fns'
import { formatDay, isWithin, parseDay } from './utils/date'
import {
  groupByDay,
  groupByWeeks,
  mergeWeekIndices,
} from './utils/stateIndices'
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators'
import { from as fromPromise, of } from 'rxjs'
import { IPeriod } from '../generated/protobuf'

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

const markPeriod = (periods: IPeriod[], day: Day) => {
  if (!day.bleeding) {
    return periods
  }

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

  return newPeriods
}

const unmarkPeriod = (periods: IPeriod[], day: Day) => {
  if (day.bleeding) {
    return periods
  }
  // FIXME: Implement else case properly
  return periods
}

export type Range = { from: string; to: string }
export type DayIndex = { [date: string]: Day }
export type WeekIndexData = {
  week: number
  year: number
  // Volatile means that the we do not yet have data for this day and created an empty one
  asList: (Day & { volatile?: boolean })[]
  index: DayIndex
}
export type WeekIndex = {
  [yearWeek: string]: WeekIndexData
}

export type DaysStateType = {
  range: Range | null
  byWeek: WeekIndex
  byDay: DayIndex
  periodStats: IPeriod[]
  loading: boolean
  error?: string
}

const days = createSlice({
  name: 'days',
  initialState: {
    range: null,
    byWeek: {},
    byDay: {},
    periodStats: [],
    loading: false,
    error: undefined,
  } as DaysStateType,
  reducers: {
    pending: (state: DaysStateType, _: PayloadAction<Duration | undefined>) => {
      return {
        ...state,
        loading: true,
      }
    },
    rejected: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    },
    fulfilled: (
      state,
      action: PayloadAction<{
        byWeek: WeekIndex
        byDay: DayIndex
        range: Range
      }>,
    ) => {
      const payload = action.payload
      const range = payload.range
      return {
        ...state,
        range,
        byWeek: mergeWeekIndices(state.byWeek, payload.byWeek),
        byDay: { ...state.byDay, ...payload.byDay },
        loading: false,
      }
    },
    singleFulfilled: (
      state,
      action: PayloadAction<{
        day: Day
        periods: IPeriod[]
      }>,
    ) => {
      const payload = action.payload
      return {
        ...state,
        periods: payload.periods,
        loading: false,
      }
    },
  },
})

export type MyEpic = Epic<AnyAction, AnyAction, RootState>

const fetchRangeEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchRange.match),
    filter((action) => {
      const range = state$.value.days.range
      const to = parseDay(action.payload.to)
      const from = parseDay(action.payload.from)

      if (!range || action.payload.refresh) {
        return true
      }
      // TODO: Do not fetch the whole data is part of it is already in the state
      return !isWithin(
        { from, to },
        { from: parseDay(range.from), to: parseDay(range.from) },
      )
    }),
    switchMap((action) => {
      const range = state$.value.days.range
      const to = parseDay(action.payload.to)
      const from = parseDay(action.payload.from)

      return fromPromise(CylaModule.fetchDaysByRange(from, to)).pipe(
        map((fetchedDays: Day[]) => {
          const now = new Date()
          return {
            byDay: groupByDay(fetchedDays),
            byWeek: groupByWeeks(fetchedDays),
            range: {
              to: range ? range.to : formatDay(now),
              from: formatDay(from),
            },
          }
        }),
        map((result: { byWeek: WeekIndex; byDay: DayIndex; range: Range }) =>
          days.actions.fulfilled(result),
        ),
        catchError((err: Error) => of(days.actions.rejected(err.message))),
      )
    }),
  )

const fetchDurationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchDuration.match),
    map(() => days.actions.pending()),
    switchMap((action) => {
      const range = state$.value.days.range
      const now = new Date()
      const to = range ? parseDay(range.from) : now
      const from = sub(to, action.payload ?? { months: 1 })

      return fromPromise(CylaModule.fetchDaysByRange(from, to)).pipe(
        map((fetchedDays: Day[]) => {
          const dateStringFrom = formatDay(from)
          const dateStringTo = formatDay(to)
          return {
            byDay: groupByDay(fetchedDays),
            byWeek: groupByWeeks(fetchedDays),
            range: range
              ? {
                  to: isAfter(to, parseDay(range.to)) ? dateStringTo : range.to,
                  from: isBefore(from, parseDay(range.from))
                    ? dateStringFrom
                    : range.from,
                }
              : { from: dateStringFrom, to: dateStringTo },
          }
        }),
        map((result: { byWeek: WeekIndex; byDay: DayIndex; range: Range }) =>
          days.actions.fulfilled(result),
        ),
        catchError((err: Error) => of(days.actions.rejected(err.message))),
      )
    }),
  )

const saveDayEpic: MyEpic = (action$, $state) =>
  action$.pipe(
    filter(saveDay.match),
    mergeMap((action) => {
      const day: Day = action.payload
      if (!$state.value.connectivity.online) {
        return of(days.actions.rejected('Unable to save day while offline.'))
      }

      const periods = $state.value.days.periodStats
      return fromPromise(
        CylaModule.saveDay(
          day,
          day.bleeding ? markPeriod(periods, day) : unmarkPeriod(periods, day),
        ),
      ).pipe(
        mergeMap(() => {
          return of(
            // FIXME: reloading the day is probably not the most efficient way
            fetchRange({
              from: day.date,
              to: day.date,
              refresh: true,
            }) as AnyAction,
            days.actions.singleFulfilled({ day, periods }) as AnyAction,
          )
        }),
      )
    }),
  )
export const saveDay = createAction<Day>('says/saveDay')
export const fetchDuration = createAction<Duration | undefined>(
  'days/fetchDuration',
)
export const fetchRange = createAction<{
  from: string
  to: string
  refresh?: boolean
}>('days/fetchRange')

export const epic = combineEpics(fetchRangeEpic, fetchDurationEpic, saveDayEpic)
export const reducer = days.reducer
