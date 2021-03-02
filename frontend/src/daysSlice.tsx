import {
  AnyAction,
  createAction,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
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
import {
  catchError,
  concatMap,
  delay,
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
} from 'rxjs/operators'
import { EMPTY, from, from as fromPromise, of } from 'rxjs'
import { Period, Day } from './types'
import { markPeriod } from './utils/periods'

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
  periodStats: Period[]
  loading: boolean
  error?: string
}

const initialState: DaysStateType = {
  range: null,
  byWeek: {},
  byDay: {},
  periodStats: [],
  loading: false,
  error: undefined,
}

const days = createSlice({
  name: 'days',
  initialState: initialState,
  reducers: {
    reset: () => initialState,
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
        periodStats: Period[]
      }>,
    ) => {
      const payload = action.payload
      return {
        ...state,
        periodStats: payload.periodStats,
        loading: false,
      }
    },
    periodStatsFulfilled: (
      state,
      action: PayloadAction<{
        periodStats: Period[]
      }>,
    ) => {
      const payload = action.payload
      return {
        ...state,
        periodStats: payload.periodStats,
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
      // TODO: Optimisation: Do not fetch the whole data is part of it is already in the state
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
        startWith(days.actions.pending()),
        catchError((err: Error) => of(days.actions.rejected(err.message))),
      )
    }),
  )

const fetchDurationEpic: MyEpic = (action$, state$) =>
  action$.pipe(
    filter(fetchDuration.match),
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
        startWith(days.actions.pending()),
        catchError((err: Error) => of(days.actions.rejected(err.message))),
      )
    }),
  )

const saveMockDaysEpic: MyEpic = (action$) =>
  action$.pipe(
    filter(saveMockDays.match),
    concatMap((action) => {
      const daysToSave: Day[] = action.payload
      return from(daysToSave).pipe(
        concatMap((day) => {
          return fromPromise(CylaModule.fetchPeriodStats()).pipe(
            delay(100),
            concatMap((fetchedStats) => {
              const { periodStats, prevHashValue } = fetchedStats
              const stats = markPeriod(periodStats.periods, day)
              return fromPromise(
                CylaModule.saveDay(day, stats, prevHashValue),
              ).pipe(
                delay(100),
                catchError((e) => {
                  return of(
                    days.actions.rejected(
                      `Unable to save day because of ${e.message}.`,
                    ),
                  )
                }),
              )
            }),
            catchError((e) => {
              return of(
                days.actions.rejected(
                  `Unable to fetch period stats: ${e.message}.`,
                ),
              )
            }),
          )
        }),
        mergeMap(() => {
          return EMPTY
        }),
      )
    }),
  )

const saveDayEpic: MyEpic = (action$, $state) =>
  action$.pipe(
    filter(saveDay.match),
    switchMap((action) => {
      const day: Day = action.payload
      return fromPromise(CylaModule.fetchPeriodStats()).pipe(
        switchMap((fetchedStats) => {
          const { periodStats, prevHashValue } = fetchedStats
          if (!$state.value.connectivity.online) {
            return of(
              days.actions.rejected('Unable to save day while offline.'),
            )
          }

          const stats = markPeriod(periodStats.periods, day)
          return fromPromise(
            CylaModule.saveDay(day, stats, prevHashValue),
          ).pipe(
            mergeMap(() => {
              return of(
                // FIXME: Optimisation: reloading the day is probably not the most efficient way
                fetchRange({
                  from: day.date,
                  to: day.date,
                  refresh: true,
                }) as AnyAction,
                days.actions.singleFulfilled({
                  day,
                  periodStats: stats,
                }) as AnyAction,
              )
            }),
            catchError((e) => {
              return of(
                days.actions.rejected(
                  `Unable to save day because of ${e.message}.`,
                ),
              )
            }),
          )
        }),
        catchError((e) => {
          return of(
            days.actions.rejected(
              `Unable to fetch period stats: ${e.message}.`,
            ),
          )
        }),
      )
    }),
  )

const fetchPeriodStatsEpic: MyEpic = (action$) => {
  return action$.pipe(
    filter(fetchPeriodStats.match),
    switchMap(() => {
      return fromPromise(CylaModule.fetchPeriodStats()).pipe(
        map((stats) =>
          days.actions.periodStatsFulfilled({
            periodStats: stats.periodStats.periods,
          }),
        ),
        catchError((e) => {
          return of(
            days.actions.rejected(
              `Unable to fetch period stats: ${e.message}.`,
            ),
          )
        }),
      )
    }),
  )
}

export const fetchPeriodStats = createAction<void>('days/fetchPeriodStats')
export const saveMockDays = createAction<Day[]>('days/saveMockDays')
export const saveDay = createAction<Day>('days/saveDay')
export const fetchDuration = createAction<Duration | undefined>(
  'days/fetchDuration',
)
export const fetchRange = createAction<{
  from: string
  to: string
  refresh?: boolean
}>('days/fetchRange')

export const epic = combineEpics(
  fetchRangeEpic,
  fetchDurationEpic,
  saveDayEpic,
  fetchPeriodStatsEpic,
  saveMockDaysEpic,
)

export const resetDays = days.actions.reset

export const reducer = days.reducer
