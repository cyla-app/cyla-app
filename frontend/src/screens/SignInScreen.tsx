import React from 'react'
import { View, ViewStyle } from 'react-native'
import { Headline } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { RootState } from '../App'
import { signIn } from '../sessionSlice'
import ServerSelectionButton from '../components/ServerSelectionButton'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'

type SignInScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SignIn'
>

type PropType = {
  navigation: SignInScreenNavigationProp
}

export default ({ navigation }: PropType) => {
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
      <ServerSelectionButton
        onPress={() => navigation.navigate('ServerChange')}
      />
    </View>
  )
}
