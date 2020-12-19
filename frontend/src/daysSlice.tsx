import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'

export const fetchAllDays = createAsyncThunk('days/fetchAll', async () => {
  return (await CylaModule.fetchDaysByMonths(12)) as Day[]
})

const days = createSlice({
  name: 'days',
  initialState: [] as Day[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllDays.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export default days.reducer
