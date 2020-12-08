import React from 'react'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import AddScreen from '../screens/AddScreen'
import { NavigatorScreenParams } from '@react-navigation/native'
import TabBarNavigation, { TabsParamList } from './TabBarNavigation'
import { StatusBar } from 'react-native'
import { useTheme } from 'react-native-paper'

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Add: undefined
}

const Stack = createStackNavigator<MainStackParamList>()

export default () => {
  const { colors } = useTheme()

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.background}
        animated
      />
      <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
        <Stack.Screen name="Tabs" component={TabBarNavigation} />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureEnabled: true,
            gestureResponseDistance: {
              vertical: 200,
            },
            cardStyle: {
              backgroundColor: 'transparent',
              marginTop: 150,
              flex: 1,
            },
          }}
        />
      </Stack.Navigator>
    </>
  )
}
