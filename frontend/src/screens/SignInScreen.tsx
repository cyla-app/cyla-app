import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Headline } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { RootState } from '../App'
import { signIn } from '../sessionSlice'

export default () => {
  const isSessionLoading = useSelector<RootState, boolean>(
    (state) => state.session.loading,
  )
  const dispatch = useDispatch()

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle

  return (
    <View style={containerStyle}>
      <Headline>Sign In</Headline>
      <LoginForm
        repeatPassphrase={false}
        loading={isSessionLoading}
        continueName="Sign In"
        onSave={(username: string, passphrase: string) => {
          dispatch(signIn({ username, passphrase }))
        }}
      />
    </View>
  )
}
