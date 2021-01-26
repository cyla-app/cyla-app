import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Period } from '../generated/protobuf'
import { Bleeding, Day } from '../generated'

type StatisticsStateType = {
  period: Period[]
}

type NonNullBleeding = { bleeding: Bleeding }

const statistics = createSlice({
  name: 'statistics',
  initialState: {
    period: [],
  } as StatisticsStateType,
  reducers: {
    markPeriod: (state, action: PayloadAction<Day>) => {
      const day = action.payload
      if (!day.bleeding) {
        return state
      }

      return state
    },
    unmarkPeriod: (state, action: PayloadAction<Day>) => {
      return state
    },
  },
})

export const markPeriod = statistics.actions.markPeriod
export const unmarkPeriod = statistics.actions.unmarkPeriod

export const reducer = statistics.reducer
