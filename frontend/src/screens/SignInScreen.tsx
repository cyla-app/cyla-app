import React, { useState } from 'react'
import { View, ViewStyle } from 'react-native'
import { ActivityIndicator, Headline, Snackbar } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { RootState } from '../App'
import { signIn } from '../sessionSlice'

export default () => {
  const isProfileLoading = useSelector<RootState>(
    (state) => state.session.loading,
  )
  const dispatch = useDispatch()

  if (isProfileLoading) {
    return <ActivityIndicator animating={true} />
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  } as ViewStyle

  return (
    <View style={containerStyle}>
      <Headline>Sign In</Headline>
      <LoginForm
        continueName="Sign In"
        onSave={(username: string, passphrase: string) => {
          dispatch(signIn({ username, passphrase }))
        }}
      />
    </View>
  )
}
