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
import { ActivityIndicator, useTheme } from 'react-native-paper'
import { View } from 'react-native'
import ServerChangeScreen from '../screens/ServerChangeScreen'
import SharingScreen from '../screens/SharingScreen'

export type MainStackParamList = {
  SignUp: undefined
  SignIn: undefined
  ServerChange: undefined
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Share: undefined
  Detail: { day: Day }
}

const Stack = createStackNavigator<MainStackParamList>()

export default () => {
  const { colors } = useTheme()
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
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors.background,
          }}>
          <ActivityIndicator size={100} />
        </View>
      </>
    )
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
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Share" component={SharingScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  )
}
