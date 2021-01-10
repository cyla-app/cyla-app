import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { ActivityIndicator, Headline } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { setSignedIn } from '../profileSlice'
import { fetchAllDays } from '../daysSlice'
import LoginForm from '../components/LoginForm'

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
      await CylaModule.setupUserKeyBackup(username, passphrase)
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
      <Headline>Sign In</Headline>
      <LoginForm
        onSave={(username: string, passphrase: string) => {
          signIn(username, passphrase)
        }}
      />
    </View>
  )
}
