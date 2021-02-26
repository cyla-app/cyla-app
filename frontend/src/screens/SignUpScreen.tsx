import React from 'react'
import { View } from 'react-native'
import { Button, Headline } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { RootState } from '../App'
import { signUp } from '../sessionSlice'
import ServerSelectionButton from '../components/ServerSelectionButton'
import { useKeyboardStatus } from '../hooks/useKeyboardStatus'

type SignUpScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SignUp'
>

type PropType = {
  navigation: SignUpScreenNavigationProp
}

// <SignUnScreen navigation={blabla} />

export default ({ navigation }: PropType) => {
  const isSessionLoading = useSelector<RootState, boolean>(
    (state) => state.session.loading,
  )
  const dispatch = useDispatch()
  const isOpen = useKeyboardStatus()

  return (
    <>
      <View
        style={{
          flex: 1,
          padding: 40,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Headline style={{ textAlign: 'center' }}>Sign Up</Headline>
          <LoginForm
            repeatPassphrase={true}
            loading={isSessionLoading}
            continueName="Sign Up"
            onSave={(username: string, passphrase: string) => {
              dispatch(signUp({ username, passphrase }))
            }}
          />
        </View>

        {!isOpen && (
          <View
            style={{
              justifyContent: 'flex-end',
            }}>
            <Button mode="text" onPress={() => navigation.navigate('SignIn')}>
              Sign In instead
            </Button>
            <ServerSelectionButton
              onPress={() => navigation.navigate('ServerChange')}
            />
          </View>
        )}
      </View>
    </>
  )
}
