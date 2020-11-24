import React from 'react'
import { StatusBar } from 'react-native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { Text, useTheme } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { BlurView } from 'expo-blur'
import Fontisto from 'react-native-vector-icons/Fontisto'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import MoreScreen from '../screens/MoreScreen'
import ProfileScreen from '../screens/ProfileScreen'
import AddScreen from '../screens/AddScreen'

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
}: {
  color: string
  children: React.ReactNode
}) => {
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 20,
        textAlign: 'center',
        color: color,
      }}>
      {children}
    </Text>
  )
}

const Stack = createStackNavigator()

const Tab = createBottomTabNavigator()

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
          name="daily"
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
          name="calendar"
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
          name="more"
          component={MoreScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <NavigationBarIcon color={color} size={20} name={'more-v-a'} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>More</NavigationBarLabel>
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
        <Stack.Screen name="Home" component={BottomBarNavigation} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
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
