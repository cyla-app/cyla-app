import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Day } from '../generated'
import CylaModule from './modules/CylaModule'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './App'

export const fetchAllDays = createAsyncThunk('days/fetchAll', async () => {
  return (await CylaModule.fetchDaysByMonths(6)) as Day[]
})

type StateType = {
  days: Day[]
  loading: boolean
}

const days = createSlice({
  name: 'days',
  initialState: {
    days: [],
    loading: false,
  } as StateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDays.fulfilled, (state, action) => {
        return {
          ...state,
          days: action.payload,
          loading: false,
        }
      })
      .addCase(fetchAllDays.rejected, (state) => {
        return {
          ...state,
          loading: false,
        }
      })
      .addCase(fetchAllDays.pending, (state) => {
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
      dispatch(fetchAllDays())
    }, [dispatch]),
  ]
}
