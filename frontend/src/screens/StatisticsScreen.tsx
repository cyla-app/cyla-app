import { useSelector } from 'react-redux'
import { RootState } from '../App'
import React from 'react'
import { DaysStateType } from '../daysSlice'
import useLoadMore from '../hooks/useLoadMore'
import Chart from '../components/chart/Chart'

export default () => {
  const days = useSelector<RootState, DaysStateType>((state) => state.days)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, loadMore] = useLoadMore()

  return (
    <Chart weekIndex={days.byWeek} dayIndex={days.byDay} loadMore={loadMore} />
  )
}
