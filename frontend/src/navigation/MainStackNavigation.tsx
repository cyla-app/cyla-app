import React, { useEffect, useState } from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabBarNavigation, { TabsParamList } from './TabBarNavigation'
import CylaModule from '../modules/CylaModule'
import SignUpScreen from '../screens/SignUpScreen'
import { Text } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { Day } from '../../generated'
import DetailScreen from '../screens/DetailScreen'
import { setSignedIn } from '../profileSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { fetchAllDays } from '../daysSlice'

export type MainStackParamList = {
  SignUp: undefined
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Detail: { day: Day }
}

const Stack = createStackNavigator<MainStackParamList>()

export default () => {
  const [loading, setLoading] = useState<boolean>(true)
  const isSignedIn = useSelector<RootState>((state) => state.profile.signedIn)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkIfSignedIn = async () => {
      setLoading(true)
      const decryptionService = CylaModule
      const isSignedIn = await decryptionService.isUserSignedIn()

      if (isSignedIn) {
        await decryptionService.setupUserKey()
      }

      await dispatch(fetchAllDays()) // FIXME probably not the best idea to fetch all at app launch
      dispatch(setSignedIn(isSignedIn))
      setLoading(false)
    }

    checkIfSignedIn().catch((e: Error) => {
      setError(e.message)
    })
  }, [dispatch])

  if (error) {
    return <Text>error</Text>
  }

  if (loading) {
    return <ActivityIndicator animating={true} />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
      {!isSignedIn ? (
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: 'Sign in',
            animationTypeForReplace: 'pop',
          }}
        />
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
        </>
      )}
    </Stack.Navigator>
  )
}
