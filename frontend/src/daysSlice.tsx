import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { useSelector } from 'react-redux'
import { RootState } from './App'
import { format, getDay, getWeek, setDay, startOfWeek, sub } from 'date-fns'

const DAYS_IN_WEEK = 7

const groupByDay = (days: Day[]) =>
  Object.fromEntries(days.map((day) => [day.date, day]))

const groupByWeeks = (dayList: Day[]) =>
  dayList.reduce((acc: WeekIndex, day) => {
    const date = new Date(day.date)
    const week = getWeek(date)
    const weekDay = getDay(date)
    // Group initialization
    if (!acc[week]) {
      const weekStart = startOfWeek(date)

      acc[week] = {
        week,
        index: {},
        asList: [...Array(DAYS_IN_WEEK).keys()].map((i) => ({
          date: format(setDay(weekStart, i), 'yyyy-MM-dd'),
        })),
      }
    }

    // Grouping
    acc[week].index[day.date] = day
    acc[week].asList[weekDay] = day
    return acc
  }, {})

type Range = { from: Date; to: Date }
export type DayIndex = { [date: string]: Day }
export type WeekIndexData = { week: number; asList: Day[]; index: DayIndex }
export type WeekIndex = {
  [weekIndex: number]: WeekIndexData
}

export type DaysStateType = {
  range: { from: string; to: string } | null
  byWeek: WeekIndex
  byDay: DayIndex
  loading: boolean
}

export const fetchMoreDays = createAsyncThunk<
  { byWeek: WeekIndex; byDay: DayIndex; range: Range },
  void,
  { state: DaysStateType }
>('days/fetchMoreDays', async (_, thunkAPI) => {
  const range = thunkAPI.getState().range
  const to = range ? new Date(range.to) : new Date()
  const from = sub(to, { months: 1 })
  const days = await CylaModule.fetchDaysByRange(from, to)
  return {
    byDay: groupByDay(days),
    byWeek: groupByWeeks(days),
    range: {
      to,
      from,
    },
  }
})

export const INITIAL_MONTHS = 2

export const fetchLastMonths = createAsyncThunk<
  { byWeek: WeekIndex; byDay: DayIndex; range: Range },
  { reference?: Date; months?: number },
  { state: DaysStateType }
>(
  'days/fetchLastMonths',
  async ({ reference = new Date(), months = INITIAL_MONTHS }) => {
    const to = reference
    const from = sub(to, { months })
    const days = await CylaModule.fetchDaysByRange(from, to)
    return {
      byDay: groupByDay(days),
      byWeek: groupByWeeks(days),
      range: {
        to,
        from,
      },
    }
  },
)

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
      ReturnType<
        typeof fetchMoreDays.fulfilled | typeof fetchLastMonths.fulfilled
      >
    > = (state, action) => {
      const range: Range = action.payload.range
      return {
        ...state,
        range: {
          from: format(range.from, 'yyyy-MM-dd'),
          to: format(range.to, 'yyyy-MM-dd'),
        },
        byWeek: { ...state.byWeek, ...action.payload.byWeek }, // FIXME: Merge deep
        byDay: { ...state.byDay, ...action.payload.byDay },
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
      .addCase(fetchMoreDays.fulfilled, fulfilledReducer)
      .addCase(fetchMoreDays.rejected, rejectReducer)
      .addCase(fetchMoreDays.pending, pendingReducer)

    builder
      .addCase(fetchLastMonths.fulfilled, fulfilledReducer)
      .addCase(fetchLastMonths.rejected, rejectReducer)
      .addCase(fetchLastMonths.pending, pendingReducer)
  },
})

export default days.reducer

export const useRefresh = (): [boolean, () => void] => {
  //const dispatch = useDispatch()
  const loading = useSelector<RootState, boolean>((state) => state.days.loading)

  return [
    loading,
    //useCallback(() => {
    // TODO: Only reload data alredy loaded
    //  dispatch(fetchAllDays())
    //}, [dispatch]),
    () => {},
  ]
}
