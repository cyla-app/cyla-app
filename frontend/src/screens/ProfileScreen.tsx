import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import DecryptionService from '../decryption/DecryptionService'
import { Day } from '../../generated'

export default () => {
  const [userId, setUserId] = useState<string>('')
  const [days, setDays] = useState<Day[]>([])

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await new DecryptionService().getUserId())
      setDays(await new DecryptionService().fetchDaysByMonths(1))
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
