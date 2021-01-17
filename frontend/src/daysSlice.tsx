import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

//export const fetchAllDays = createAsyncThunk('days/fetchAll', async () => {
//  const MAX_YEARS_FETCH = 2
//  const to = new Date()
//  const from = sub(to, { years: MAX_YEARS_FETCH })
//  return fillEmptyDays(from, to, await CylaModule.fetchDaysByRange(from, to))
//})

export const fetchMoreDays = createAsyncThunk<
  { days: DayIndex; lastDayFetched: Date },
  void,
  { state: StateType }
>('days/fetchMoreDays', async (_, thunkAPI) => {
  const state = thunkAPI.getState()
  const to = state.lastDayFetched ? new Date(state.lastDayFetched) : new Date()
  const from = sub(to, { months: 1 })
  return {
    days: fillEmptyDays(from, to, await CylaModule.fetchDaysByRange(from, to)),
    lastDayFetched: from,
  }
})

export const INITIAL_MONTHS = 2

export const fetchLastMonths = createAsyncThunk<
  { days: DayIndex },
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
    }
  },
)

export type DayIndex = { [date: string]: Day }
type StateType = {
  lastDayFetched: string | null
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
    // builder
    //   .addCase(fetchAllDays.fulfilled, (state, action) => {
    //     return {
    //       ...state,
    //       days: action.payload,
    //       loading: false,
    //     }
    //   })
    //   .addCase(fetchAllDays.rejected, (state) => {
    //     return {
    //       ...state,
    //       loading: false,
    //     }
    //   })
    //   .addCase(fetchAllDays.pending, (state) => {
    //     return {
    //       ...state,
    //       loading: true,
    //     }
    //   })

    builder
      .addCase(fetchMoreDays.fulfilled, (state, action) => {
        return {
          ...state,
          lastDayFetched: format(action.payload.lastDayFetched, 'yyyy-MM-dd'),
          days: { ...state.days, ...action.payload.days },
          loading: false,
        }
      })
      .addCase(fetchMoreDays.rejected, (state) => {
        return {
          ...state,
          loading: false,
        }
      })
      .addCase(fetchMoreDays.pending, (state) => {
        return {
          ...state,
          loading: true,
        }
      })

    builder
      .addCase(fetchLastMonths.fulfilled, (state, action) => {
        return {
          ...state,
          days: { ...state.days, ...action.payload.days },
          loading: false,
        }
      })
      .addCase(fetchLastMonths.rejected, (state) => {
        return {
          ...state,
          loading: false,
        }
      })
      .addCase(fetchLastMonths.pending, (state) => {
        return {
          ...state,
          loading: true,
        }
      })
  },
})

export default days.reducer

export const useRefresh = (): [boolean, () => void] => {
  const dispatch = useDispatch()
  const loading = useSelector<RootState, boolean>((state) => state.days.loading)

  return [
    loading,
    useCallback(() => {
      // TODO: Only reload data alredy loaded
      //dispatch(fetchAllDays())
    }, [dispatch]),
  ]
}
