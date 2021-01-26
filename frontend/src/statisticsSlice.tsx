import { createSlice } from '@reduxjs/toolkit'
import { Period } from '../generated/protobuf'

type StatisticsStateType = {
  period: Period[]
}

const statistics = createSlice({
  name: 'statistics',
  initialState: {
    period: [],
  } as StatisticsStateType,
  reducers: {
    markPeriod: (state, action) => {
      return state
    },
    unmarkPeriod: (state, action) => {
      return state
    },
  },
})

export const markPeriod = statistics.actions.markPeriod
export const unmarkPeriod = statistics.actions.unmarkPeriod

export const reducer = statistics.reducer
