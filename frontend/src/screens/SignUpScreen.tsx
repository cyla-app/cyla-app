import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Button, Headline } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { RootState } from '../App'
import { signUp } from '../sessionSlice'

type SignUpScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SignUp'
>

type PropType = {
  navigation: SignUpScreenNavigationProp
}

export default ({ navigation }: PropType) => {
  const isSessionLoading = useSelector<RootState, boolean>(
    (state) => state.session.loading,
  )
  const dispatch = useDispatch()

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  } as ViewStyle

  return (
    <View style={containerStyle}>
      <Headline>Sign Up</Headline>
      <LoginForm
        repeatPassphrase={true}
        loading={isSessionLoading}
        continueName="Sign Up"
        onSave={(username: string, passphrase: string) => {
          dispatch(signUp({ username, passphrase }))
        }}
      />
      <Button mode="text" onPress={() => navigation.navigate('SignIn')}>
        I already have an account. Take me to the Sign In.
      </Button>
    </View>
  )
}
