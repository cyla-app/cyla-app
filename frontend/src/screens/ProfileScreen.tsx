import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import DecryptionService from '../decryption/DecryptionService'

export default () => {
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await new DecryptionService().getUserId())
    }

    getUserId()
  }, [])

  return <Text>{userId}</Text>
}
