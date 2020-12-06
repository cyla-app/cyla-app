import React from 'react'
import { StatusBar } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Fontisto from 'react-native-vector-icons/Fontisto'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
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

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Statistics: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabsParamList>()

export default () => {
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
