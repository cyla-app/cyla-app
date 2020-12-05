import React from 'react'
import { StatusBar } from 'react-native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { Text, useTheme } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Fontisto from 'react-native-vector-icons/Fontisto'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import ProfileScreen from '../screens/ProfileScreen'
import AddScreen from '../screens/AddScreen'
import { NavigatorScreenParams } from '@react-navigation/native'
import NYIScreen from '../screens/NYIScreen'

const NavigationBarIcon = ({
  color,
  size,
  name,
}: {
  color: string
  size: number
  name: string
}) => {
  return (
    <Fontisto color={color} size={size} name={name} style={{ marginTop: 5 }} />
  )
}

const NavigationBarLabel = ({
  color,
  children,
}: // focused,
{
  color: string
  children: React.ReactNode
  focused: boolean
}) => {
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 20,
        height: 20,
        textAlign: 'center',
        color: color,
      }}>
      {/*{focused ? children : null}*/}
      {children}
    </Text>
  )
}

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>
  Profile: undefined
  Add: undefined
}

const Stack = createStackNavigator<MainStackParamList>()

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Statistics: undefined
  More: undefined
}

const Tab = createBottomTabNavigator<TabsParamList>()

const BottomBarNavigation = () => {
  const { colors } = useTheme()

  return (
    <React.Fragment>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.background}
        animated
      />
      <Tab.Navigator>
        <Tab.Screen
          name="Daily"
          component={DailyScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <NavigationBarIcon
                color={color}
                size={20}
                name={'circle-o-notch'}
              />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Today</NavigationBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <NavigationBarIcon color={color} size={20} name={'date'} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Calendar</NavigationBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={NYIScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <NavigationBarIcon color={color} size={20} name={'area-chart'} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Statistics</NavigationBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={NYIScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <NavigationBarIcon color={color} size={20} name={'person'} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Profile</NavigationBarLabel>
            ),
          }}
        />
      </Tab.Navigator>
    </React.Fragment>
  )
}

export default () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
        <Stack.Screen name="Tabs" component={BottomBarNavigation} />
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
