import React, { useEffect, useState } from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import AddScreen from '../screens/AddScreen'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabBarNavigation, { TabsParamList } from './TabBarNavigation'
import CylaModule from '../decryption/CylaModule'
import SignUpScreen from '../screens/SignUpScreen'
import { Text } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

export type MainStackParamList = {
  SignUp: undefined
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Add: undefined
}

const Stack = createStackNavigator<MainStackParamList>()

export default () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkIfSignedIn = async () => {
      setLoading(true)
      const decryptionService = CylaModule
      const isSignedIn = await decryptionService.isUserSignedIn()

      if (isSignedIn) {
        await decryptionService.setupUserKey()
      }

      setIsSignedIn(isSignedIn)
      setLoading(false)
    }

    checkIfSignedIn().catch((e: Error) => {
      setError(e.message)
    })
  }, [])

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
          component={() => (
            <SignUpScreen onSignIn={() => setIsSignedIn(true)} />
          )}
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
            name="Add"
            component={AddScreen}
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
