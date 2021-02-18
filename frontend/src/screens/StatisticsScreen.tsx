import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import React, { useEffect } from 'react'
import { DaysStateType, fetchDuration } from '../daysSlice'
import useLoadMore from '../hooks/useLoadMore'
import Chart from '../components/chart/Chart'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { RefreshControl, ScrollView, Text } from 'react-native'
import useRefresh from '../hooks/useRefresh'
import { Button } from 'react-native-paper'

export default () => {
  const days = useSelector<RootState, DaysStateType>((state) => state.days)
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, refresh] = useRefresh()
  const [loadingMore, loadMore] = useLoadMore()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchDuration())
  }, [dispatch])

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          marginBottom: 20,
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }>
        {Object.keys(days.byWeek).length !== 0 ? (
          <Chart
            weekIndex={days.byWeek}
            dayIndex={days.byDay}
            loadMore={loadMore}
            loading={loadingMore}
          />
        ) : (
          <Button
            onPress={() => {
              loadMore()
            }}>
            No days in the past months. Load more?
          </Button>
        )}
        <DaysErrorSnackbar daysError={daysError} />
      </ScrollView>
    </>
  )
}
