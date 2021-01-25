import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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

export const fetchDuration = createAsyncThunk<
  { byWeek: WeekIndex; byDay: DayIndex; range: Range },
  Duration | undefined,
  { state: RootState }
>('days/fetchDuration', async (duration = { months: 1 }, thunkAPI) => {
  const range = thunkAPI.getState().days.range
  const now = new Date()
  const to = range ? parseDay(range.from) : now
  const from = sub(to, duration)
  const days = await CylaModule.fetchDaysByRange(from, to)
  return {
    byDay: groupByDay(days),
    byWeek: groupByWeeks(days),
    range: {
      to: range ? range.to : formatDay(now),
      from: formatDay(from),
    },
  }
})

export const fetchRange = createAsyncThunk<
  { byWeek: WeekIndex; byDay: DayIndex; range: Range },
  { from: Date; to: Date; refresh?: boolean },
  { state: RootState }
>('days/fetchRange', async (args, thunkAPI) => {
  const range = thunkAPI.getState().days.range
  const to = args.to
  const from = args.from

  if (!args.refresh && range) {
    // TODO: Do not fetch the whole data is part of it is already in the state
    const within = isWithin(
      { from, to },
      { from: parseDay(range.from), to: parseDay(range.from) },
    )
    if (within) {
      return { byDay: {}, byWeek: {}, range: range }
    }
  }

  const days = await CylaModule.fetchDaysByRange(from, to)
  const dateStringFrom = formatDay(args.from)
  const dateStringTo = formatDay(args.to)
  return {
    byDay: groupByDay(days),
    byWeek: groupByWeeks(days),
    range: range
      ? {
          to: isAfter(to, parseDay(range.to)) ? dateStringTo : range.to,
          from: isBefore(from, parseDay(range.from))
            ? dateStringFrom
            : range.from,
        }
      : { from: dateStringFrom, to: dateStringTo },
  }
})

const days = createSlice({
  name: 'days',
  initialState: {
    byWeek: {},
    byDay: {},
    loading: false,
  } as DaysStateType,
  reducers: {},
  extraReducers: (builder) => {
    const fulfilledReducer: CaseReducer<
      DaysStateType,
      ReturnType<typeof fetchDuration.fulfilled | typeof fetchRange.fulfilled>
    > = (state, action) => {
      const payload = action.payload
      const range = payload.range
      return {
        ...state,
        range,
        byWeek: mergeWeekIndices(state.byWeek, payload.byWeek),
        byDay: { ...state.byDay, ...payload.byDay },
        loading: false,
      }
    }

    const rejectReducer = (state: DaysStateType) => {
      return {
        ...state,
        loading: false,
      }
    }
    const pendingReducer = (state: DaysStateType) => {
      return {
        ...state,
        loading: true,
      }
    }
    builder
      .addCase(fetchDuration.fulfilled, fulfilledReducer)
      .addCase(fetchDuration.rejected, rejectReducer)
      .addCase(fetchDuration.pending, pendingReducer)
      .addCase(fetchRange.fulfilled, fulfilledReducer)
      .addCase(fetchRange.rejected, rejectReducer)
      .addCase(fetchRange.pending, pendingReducer)
  },
})

export default days.reducer
