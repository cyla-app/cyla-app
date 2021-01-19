import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text } from 'react-native'
import CylaModule from '../modules/CylaModule'
import { useSelector } from 'react-redux'
import { DayIndex, useRefresh } from '../daysSlice'
import { RootState } from '../App'
import { ActivityIndicator } from 'react-native-paper'

export default () => {
  const [userId, setUserId] = useState<string>('')
  const days = Object.values(
    useSelector<RootState, DayIndex>((state) => state.days.byDay), // FIXME dynamically load from state
  )

  const [loading, refresh] = useRefresh()

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await CylaModule.getUserId())
    }

    getUserId()
  }, [])

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <ScrollView
      scrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }>
      {__DEV__ ? <Text>{userId}</Text> : null}
      <Text>{JSON.stringify(days)}</Text>
    </ScrollView>
  )
}
