import {
  AnyAction,
  createAction,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
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
import { combineEpics, Epic } from 'redux-observable'
import { catchError, filter, map, switchMap } from 'rxjs/operators'
import { from as fromPromise, of } from 'rxjs'

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
  error?: string
}

const days = createSlice({
  name: 'days',
  initialState: {
    byWeek: {},
    byDay: {},
    loading: false,
    error: undefined,
  } as DaysStateType,
  reducers: {
    days$pending: (
      state: DaysStateType,
      _: PayloadAction<Duration | undefined>,
    ) => {
      return {
        ...state,
        loading: true,
      }
    },
    days$rejected: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    },
    days$fulfilled: (
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

const fetchRangeEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchRange.match),
    switchMap((action) => {
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
    }),
    map((action: { byWeek: WeekIndex; byDay: DayIndex; range: Range }) =>
      days.actions.days$fulfilled(action),
    ),
    catchError((err: Error) => of(days.actions.days$rejected(err.message))),
  )

const fetchDurationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchDuration.match),
    map(() => days.actions.days$pending()),
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
    map((action: { byWeek: WeekIndex; byDay: DayIndex; range: Range }) =>
      days.actions.days$fulfilled(action),
    ),
    catchError((err: Error) => of(days.actions.days$rejected(err.message))),
  )

export const fetchDuration = createAction<Duration | undefined>('fetchDuration')
export const fetchRange = createAction<{
  from: string
  to: string
  refresh?: boolean
}>('fetchRange')

export const epic = combineEpics(fetchRangeEpic, fetchDurationEpic)
export const reducer = days.reducer
