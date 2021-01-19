import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { ActivityIndicator, Button, Headline } from 'react-native-paper'
import { addDays, format, getDate } from 'date-fns'
import { Bleeding, Mucus } from '../../generated'
import { useDispatch } from 'react-redux'
import { setSignedIn } from '../profileSlice'
import LoginForm from '../components/LoginForm'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { fetchDuration } from '../daysSlice'

export const generateMockData = async () => {
  const randomDate = (start: Date, end: Date) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )

  const random = randomDate(new Date(2020, 0, 1), new Date(2020, 2, 1))
  for (let i = 0; i < 365; i++) {
    const day = addDays(random, i)
    await CylaModule.postDay(day, {
      date: format(day, 'yyyy-MM-dd'),
      bleeding:
        getDate(day) <= 10 && getDate(day) >= 7
          ? {
              strength: Bleeding.strength.STRONG,
            }
          : undefined,
      temperature: {
        value: 36.5 + 0.5 * Math.sin(Math.sin(0.1 * i) * i),
        timestamp: day.toISOString(),
        note: undefined,
      },
      mucus: {
        feeling: Mucus.feeling.DRY,
        texture: Mucus.texture.EGG_WHITE,
      },
    })
  }
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
      await CylaModule.setupUser(username, passphrase)
      await generateMockData()
      await dispatch(fetchDuration())

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
