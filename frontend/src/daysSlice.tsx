import {
  createSlice,
  configureStore,
  PayloadAction,
  CaseReducer,
  createAsyncThunk,
} from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'

// const setDaysReducer: CaseReducer<Day[], PayloadAction<Day[]>> = (
//   state,
//   action,
// ) => action.payload

export const fetchAllDays = createAsyncThunk('days/fetchAll', async () => {
  return (await CylaModule.fetchDaysByMonths(3)) as Day[]
})

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
