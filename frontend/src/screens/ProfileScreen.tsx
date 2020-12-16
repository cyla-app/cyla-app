import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import CylaModule from '../modules/CylaModule'
import { Day } from '../../generated'

export default () => {
  const [userId, setUserId] = useState<string>('')
  const [days, setDays] = useState<Day[]>([])

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await CylaModule.getUserId())
      setDays(await CylaModule.fetchDaysByMonths(1))
    }

    getUserId()
  }, [])

  return (
    <>
      <Text>{userId}</Text>
      <Text>{JSON.stringify(days)}</Text>
    </>
  )
}
