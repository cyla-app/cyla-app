import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { useSelector } from 'react-redux'
import { RootState } from './App'
import { add, differenceInDays, format, sub } from 'date-fns'

const fillEmptyDays = (from: Date, to: Date, dayList: Day[]) => {
  const numberOfDays = differenceInDays(from, to)
  const days = Object.fromEntries(dayList.map((day) => [day.date, day]))

  for (let i = 0; i < numberOfDays; i++) {
    const date = add(from, { days: i })
    const dateString = format(date, 'yyyy-MM-dd')
    const day = days[dateString]
    const emptyDay = { date: dateString }
    days[dateString] = day ? day : emptyDay
  }

  return days
}

type Range = { from: Date; to: Date }

export const fetchMoreDays = createAsyncThunk<
  { days: DayIndex; range: Range },
  void,
  { state: StateType }
>('days/fetchMoreDays', async (_, thunkAPI) => {
  const range = thunkAPI.getState().range
  const to = range ? new Date(range.to) : new Date()
  const from = sub(to, { months: 1 })
  return {
    days: fillEmptyDays(from, to, await CylaModule.fetchDaysByRange(from, to)),
    range: {
      to,
      from,
    },
  }
})

export const INITIAL_MONTHS = 2

export const fetchLastMonths = createAsyncThunk<
  { days: DayIndex; range: Range },
  { reference?: Date; months?: number },
  { state: StateType }
>(
  'days/fetchLastMonths',
  async ({ reference = new Date(), months = INITIAL_MONTHS }) => {
    const to = reference
    const from = sub(to, { months })
    return {
      days: fillEmptyDays(
        from,
        to,
        await CylaModule.fetchDaysByRange(from, to),
      ),
      range: {
        to,
        from,
      },
    }
  },
)

export type DayIndex = { [date: string]: Day }
type StateType = {
  range: { from: string; to: string } | null
  days: DayIndex
  loading: boolean
}

const days = createSlice({
  name: 'days',
  initialState: {
    days: {},
    loading: false,
  } as StateType,
  reducers: {},
  extraReducers: (builder) => {
    const fulfilledReducer: CaseReducer<
      StateType,
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
        days: { ...state.days, ...action.payload.days },
        loading: false,
      }
    }

    const rejectReducer = (state: StateType) => {
      return {
        ...state,
        loading: false,
      }
    }
    const pendingReducer = (state: StateType) => {
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
