import React, { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text } from 'react-native'
import CylaModule from '../modules/CylaModule'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllDays } from '../daysSlice'
import { RootState } from '../App'

export default () => {
  const [userId, setUserId] = useState<string>('')
  const days = useSelector<RootState>((state) => state.days)
  const dispatch = useDispatch()

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    dispatch(fetchAllDays())

    setRefreshing(false)
  }, [dispatch])

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await CylaModule.getUserId())
    }

    getUserId()
  }, [])

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      scrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text>{userId}</Text>
      <Text>{JSON.stringify(days)}</Text>
    </ScrollView>
  )
}
