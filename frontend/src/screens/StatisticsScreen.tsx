import { useSelector } from 'react-redux'
import { RootState } from '../App'
import React from 'react'
import { DaysStateType } from '../daysSlice'
import useLoadMore from '../hooks/useLoadMore'
import Chart from '../components/chart/Chart'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'

export default () => {
  const days = useSelector<RootState, DaysStateType>((state) => state.days)
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, loadMore] = useLoadMore()

  return (
    <>
      <Chart
        weekIndex={days.byWeek}
        dayIndex={days.byDay}
        loadMore={loadMore}
      />
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
