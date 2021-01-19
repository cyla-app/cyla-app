import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { ActivityIndicator, Headline } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { setSignedIn } from '../profileSlice'
import LoginForm from '../components/LoginForm'
import { fetchDuration } from '../daysSlice'

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

  const signIn = async (username: string, passphrase: string) => {
    setLoading(true)
    try {
      await CylaModule.login(username, passphrase)
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
      <Headline>Sign In</Headline>
      <LoginForm
        onSave={(username: string, passphrase: string) => {
          signIn(username, passphrase)
        }}
      />
    </View>
  )
}
