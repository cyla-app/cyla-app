import React from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Fontisto from 'react-native-vector-icons/Fontisto'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import NYIScreen from '../screens/NYIScreen'
import ProfileScreen from '../screens/ProfileScreen'
import StatisticsScreen from '../screens/StatisticsScreen'
import DailyIcon from './icons/DailyIcon'
import CalendarIcon from './icons/CalendarIcon'
import StatisticsIcon from './icons/StatisticsIcon'
import ProfileIcon from './icons/ProfileIcon'

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
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Daily"
          component={DailyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <DailyIcon color={color} size={size} />
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
            tabBarIcon: ({ color, size }) => (
              <CalendarIcon color={color} size={size} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Calendar</NavigationBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <StatisticsIcon color={color} size={size} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Statistics</NavigationBarLabel>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={__DEV__ ? ProfileScreen : NYIScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <ProfileIcon color={color} size={size} />
            ),
            tabBarLabel: (props) => (
              <NavigationBarLabel {...props}>Profile</NavigationBarLabel>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  )
}
