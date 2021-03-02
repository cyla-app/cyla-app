import React, { useEffect } from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
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
  Add: undefined
  Share: undefined
  ChangePassphrase: undefined
  Detail: { day: Day }
}

const Stack = createStackNavigator<MainStackParamList>()

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
      <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
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
                ...TransitionPresets.ModalSlideFromBottomIOS,
                gestureEnabled: true,
                gestureResponseDistance: {
                  vertical: 500,
                },
                cardStyle: {
                  backgroundColor: 'transparent',
                  marginTop: 150,
                  flex: 1,
                },
              }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              options={{
                ...TransitionPresets.ModalSlideFromBottomIOS,
                gestureEnabled: true,
                gestureResponseDistance: {
                  vertical: 500,
                },
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
