import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { ActivityIndicator, Button, Headline } from 'react-native-paper'
import { addDays, addMonths, format } from 'date-fns'
import { Bleeding, Day, Mucus } from '../../generated'
import { useDispatch } from 'react-redux'
import { setSignedIn } from '../profileSlice'
import { fetchAllDays } from '../daysSlice'
import LoginForm from '../components/LoginForm'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { RouteProp } from '@react-navigation/native'

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
        bleeding: {
          strength: Bleeding.strength.STRONG,
        },
        temperature: {
          value: 36,
          timestamp: new Date().toISOString(),
          note: undefined,
        },
        mucus: {
          feeling: Mucus.feeling.DRY,
          texture: Mucus.texture.EGG_WHITE,
        },
      })
    }
  }
  return (await CylaModule.fetchDaysByMonths(3)) as Day[]
}

type SignUpScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SignUp'
>

type PropType = {
  navigation: SignUpScreenNavigationProp
}

export default ({ navigation }: PropType) => {
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

  const signUp = async (username: string, passphrase: string) => {
    setLoading(true)
    try {
      await CylaModule.setupUserKeyBackup(username, passphrase)
      await generateMockData()
      await dispatch(fetchAllDays()) // FIXME probably not the best idea to fetch all at app launch

      setLoading(false)
      dispatch(setSignedIn(true))
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <View style={containerStyle}>
      <Headline>Sign Up</Headline>
      <LoginForm
        onSave={(username: string, passphrase: string) => {
          signUp(username, passphrase)
        }}
      />
      <Button mode="text" onPress={() => navigation.navigate('SignIn')}>
        I already have an account. Take me to the Sign In.
      </Button>
    </View>
  )
}
