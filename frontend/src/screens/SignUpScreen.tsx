import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import PasswordEntry from '../components/PasswordEntry'
import { ActivityIndicator } from 'react-native-paper'
import { addDays, addMonths, format } from 'date-fns'
import { Day } from '../../generated'
import { useDispatch } from 'react-redux'
import { setSignedIn } from '../profileSlice'
import { fetchAllDays } from '../daysSlice'

export const generateMockData = async () => {
  const randomDate = (start: Date, end: Date) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )

  const random = randomDate(new Date(2020, 0, 1), new Date(2020, 2, 1))
  for (let i = 0; i < 12; i++) {
    const date = addMonths(random, i)
    for (let j = 0; j < 3; j++) {
      const periodDay = addDays(date, j)
      await CylaModule.postDay(periodDay, {
        date: format(periodDay, 'yyyy-MM-dd'),
      })
    }
  }
  return (await CylaModule.fetchDaysByMonths(3)) as Day[]
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch()

  if (error) {
    return <Text>{error}</Text>
  }

  if (loading) {
    return <ActivityIndicator animating={true} />
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  } as ViewStyle

  const setup = async (passphrase: string) => {
    setLoading(true)
    try {
      await CylaModule.setupUserKey(passphrase)
      await generateMockData()

      setLoading(false)
      dispatch(setSignedIn(true))
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <View style={containerStyle}>
      <PasswordEntry
        onSave={(passphrase: string) => {
          setup(passphrase)
        }}
      />
    </View>
  )
}
