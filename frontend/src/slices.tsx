import {
  createSlice,
  configureStore,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit'
import { Day } from '../generated'

const setDaysReducer: CaseReducer<Day[], PayloadAction<Day[]>> = (
  state,
  action,
) => action.payload

const days = createSlice({
  name: 'days',
  initialState: [] as Day[],
  reducers: {
    setDays: setDaysReducer,
  },
})

export const { setDays } = days.actions

export const store = configureStore({
  reducer: days.reducer,
})
