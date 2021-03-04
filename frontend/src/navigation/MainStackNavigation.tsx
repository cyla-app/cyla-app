import React, { useEffect } from 'react'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabBarNavigation, { TabsParamList } from './TabBarNavigation'
import SignUpScreen from '../screens/SignUpScreen'
import { Day } from '../types'
import DetailScreen from '../screens/DetailScreen'
import { checkSignIn, SessionStatus } from '../sessionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import SignInScreen from '../screens/SignInScreen'
import StatusBanner from '../components/StatusBanner'
import ServerChangeScreen from '../screens/ServerChangeScreen'
import SharingScreen from '../screens/SharingScreen'
import ChangePassphrase from '../screens/ChangePassphraseScreen'
import AddScreen from '../screens/AddScreen'

export type MainStackParamList = {
  SignUp: undefined
  SignIn: undefined
  ServerChange: undefined
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Add: { date?: Date }
  Share: undefined
  ChangePassphrase: undefined
  Detail: { day: Day }
}

const Stack = createNativeStackNavigator<MainStackParamList>()

export default () => {
  const sessionStatus = useSelector<RootState>((state) => state.session.status)
  const isOnline = useSelector<RootState, boolean>(
    (state) => state.connectivity.online,
  )

  const sessionError = useSelector<RootState, string | undefined>(
    (state) => state.session.error,
  )

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkSignIn())
  }, [dispatch])

  if (sessionStatus === SessionStatus.UNKNOWN && !sessionError) {
    return null
  }

  return (
    <>
      <StatusBanner isOnline={isOnline} sessionError={sessionError} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {sessionStatus === SessionStatus.SIGNED_OUT ? (
          <>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="ServerChange" component={ServerChangeScreen} />
          </>
        ) : (
          // User is signed in
          <>
            <Stack.Screen name="Tabs" component={TabBarNavigation} />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen name="Share" component={SharingScreen} />
            <Stack.Screen
              name="ChangePassphrase"
              component={ChangePassphrase}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  )
}
