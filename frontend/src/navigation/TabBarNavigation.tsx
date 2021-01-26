import React from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import NYIScreen from '../screens/NYIScreen'
import ProfileScreen from '../screens/ProfileScreen'
import StatisticsScreen from '../screens/StatisticsScreen'
import DailyIcon from './icons/DailyIcon'
import CalendarIcon from './icons/CalendarIcon'
import StatisticsIcon from './icons/StatisticsIcon'
import ProfileIcon from './icons/ProfileIcon'
import { useTheme } from 'react-native-paper'

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
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Daily"
          component={DailyScreen}
          options={{
            tabBarIcon: ({ size }) => (
              <DailyIcon color={colors.daily} size={size} />
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
            tabBarIcon: ({ size }) => (
              <CalendarIcon color={colors.calendar} size={size} />
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
            tabBarIcon: ({ size }) => (
              <StatisticsIcon color={colors.statistics} size={size} />
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
            tabBarIcon: ({ size }) => (
              <ProfileIcon color={colors.profile} size={size} />
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
