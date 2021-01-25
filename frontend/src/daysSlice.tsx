import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { RootState } from './App'
import { isAfter, isBefore, sub } from 'date-fns'
import { formatDay, isWithin, parseDay } from './utils/date'
import {
  groupByDay,
  groupByWeeks,
  mergeWeekIndices,
} from './utils/stateIndices'
import { Epic } from 'redux-observable'
import { catchError, filter, map, switchMap, throttle } from 'rxjs/operators'
import { from as fromPromise, interval, of } from 'rxjs'

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
  loading: boolean
}

const days = createSlice({
  name: 'days',
  initialState: {
    byWeek: {},
    byDay: {},
    loading: false,
  } as DaysStateType,
  reducers: {
    fetchRange: (
      state: DaysStateType,
      _: PayloadAction<{ from: string; to: string; refresh?: boolean }>,
    ) => {
      return {
        ...state,
        loading: true,
      }
    },
    fetchDuration: (
      state: DaysStateType,
      _: PayloadAction<Duration | undefined>,
    ) => {
      return {
        ...state,
        loading: true,
      }
    },
    daysRejected: (state) => {
      return {
        ...state,
        loading: false,
      }
    },
    mergeDays: (
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
  },
})

export type MyEpic = Epic<AnyAction, AnyAction, RootState>

export const fetchRangeEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(days.actions.fetchRange.match),
    switchMap(
      (
        action: PayloadAction<{ from: string; to: string; refresh?: boolean }>,
      ) => {
        const range = state$.value.days.range
        const to = parseDay(action.payload.to)
        const from = parseDay(action.payload.from)

        if (!action.payload.refresh && range) {
          // TODO: Do not fetch the whole data is part of it is already in the state
          const within = isWithin(
            { from, to },
            { from: parseDay(range.from), to: parseDay(range.from) },
          )
          if (within) {
            return of({ byDay: {}, byWeek: {}, range: range })
          }
        }

        // return { byDay: {}, byWeek: {}, range: { from: 'new Date()', to: '' } }
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
        )
      },
    ),
    throttle(() => interval(100), { leading: true }),
    map((action: { byWeek: WeekIndex; byDay: DayIndex; range: Range }) =>
      days.actions.mergeDays(action),
    ),
    catchError(() => of(days.actions.daysRejected())),
  )

export const fetchDurationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(days.actions.fetchDuration.match),
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
      )
    }),
    throttle(() => interval(100), { leading: true }),
    map((action: { byWeek: WeekIndex; byDay: DayIndex; range: Range }) =>
      days.actions.mergeDays(action),
    ),
    catchError(() => of(days.actions.daysRejected())),
  )

export const fetchRange = days.actions.fetchRange
export const fetchDuration = days.actions.fetchDuration

export default days.reducer
