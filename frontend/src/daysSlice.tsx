import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './App'
import {
  add,
  format,
  getISODay,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  sub,
} from 'date-fns'
import { useCallback } from 'react'

export const DAYS_IN_WEEK = 7

const groupByDay = (days: Day[]) =>
  Object.fromEntries(days.map((day) => [day.date, day]))

const groupByWeeks = (dayList: Day[]) =>
  dayList.reduce((acc: WeekIndex, day) => {
    const date = new Date(day.date)
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
          date: format(add(weekStart, { days: i }), 'yyyy-MM-dd'),
        })),
      }
    }

    // Grouping
    weekIndexData = acc[key]
    weekIndexData.index[day.date] = day
    weekIndexData.asList[weekday] = day
    return acc
  }, {})

const mergeWeekIndices = (a: WeekIndex, override: WeekIndex): WeekIndex => {
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

type Range = { from: string; to: string }
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
  const to = range ? new Date(range.from) : now
  const from = sub(to, duration)
  const days = await CylaModule.fetchDaysByRange(from, to)
  return {
    byDay: groupByDay(days),
    byWeek: groupByWeeks(days),
    range: {
      to: range ? range.to : format(now, 'yyyy-MM-dd'),
      from: format(from, 'yyyy-MM-dd'),
    },
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
      ReturnType<typeof fetchDuration.fulfilled>
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
  },
})

export default days.reducer

export const useRefresh = (): [boolean, () => void] => {
  const dispatch = useDispatch()
  const range = useSelector<RootState, Range | null>(
    (state) => state.days.range,
  )
  const loading = useSelector<RootState, boolean>((state) => state.days.loading)

  return [
    loading,
    useCallback(() => {
      if (range) {
        //dispatch(fetchRange({})) FIXME
      }
    }, [dispatch]),
  ]
}

export const useLoadMore = (): [boolean, () => void] => {
  const dispatch = useDispatch()
  const loading = useSelector<RootState, boolean>((state) => state.days.loading)

  return [
    loading,
    useCallback(() => {
      dispatch(fetchDuration())
    }, [dispatch]),
  ]
}
