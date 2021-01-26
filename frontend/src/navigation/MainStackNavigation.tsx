import React, { useEffect, useState } from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabBarNavigation, { TabsParamList } from './TabBarNavigation'
import SignUpScreen from '../screens/SignUpScreen'
import { ActivityIndicator, Banner } from 'react-native-paper'
import { Day } from '../../generated'
import DetailScreen from '../screens/DetailScreen'
import { checkSignIn } from '../sessionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import SignInScreen from '../screens/SignInScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export type MainStackParamList = {
  SignUp: undefined
  SignIn: undefined
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Detail: { day: Day }
}

const Stack = createStackNavigator<MainStackParamList>()

export default () => {
  const isSignedInApp = useSelector<RootState>(
    (state) => state.session.signedIn,
  )
  const isProfileLoading = useSelector<RootState>(
    (state) => state.session.loading,
  )
  const profileError = useSelector<RootState, string | undefined>(
    (state) => state.session.signInError,
  )

  const [showError, setShowError] = useState<boolean>(true)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkSignIn())
  }, [dispatch])

  if (isProfileLoading) {
    return <ActivityIndicator animating={true} />
  }

  return (
    <>
      <Banner
        visible={showError && !!profileError}
        actions={[
          {
            label: 'Dismiss',
            onPress: () => setShowError(false),
          },
        ]}
        icon={({ size }) => (
          <MaterialCommunityIcons size={size} name={'alert-circle'} />
        )}>
        {profileError ?? 'Unknown Error'}
      </Banner>

      <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
        {!isSignedInApp ? (
          <>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
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
          </>
        )}
      </Stack.Navigator>
    </>
  )
}
