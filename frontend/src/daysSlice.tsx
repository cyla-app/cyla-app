import {
  createSlice,
  configureStore,
  PayloadAction,
  CaseReducer,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { addDays, addMonths, format } from 'date-fns'

// const setDaysReducer: CaseReducer<Day[], PayloadAction<Day[]>> = (
//   state,
//   action,
// ) => action.payload

export const fetchAllDays = createAsyncThunk('days/fetchAll', async () => {
  return (await CylaModule.fetchDaysByMonths(12)) as Day[]
})

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

export const generateMockData = async () => {
  const random = randomDate(new Date(2020, 0, 1), new Date(2020, 2, 1))
  for (let i = 0; i < 12; i++) {
    const date = addMonths(random, i)
    for (let j = 0; j < 3; j++) {
      const periodDay = addDays(date, j)
      await CylaModule.postDay(periodDay, {
        date: format(periodDay, 'yyyy-MM-dd'),
      })
    }
  }
  return (await CylaModule.fetchDaysByMonths(3)) as Day[]
}

const days = createSlice({
  name: 'days',
  initialState: [] as Day[],
  reducers: {
    // setDays: setDaysReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDays.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

// export const { setDays } = days.actions

export default days.reducer
