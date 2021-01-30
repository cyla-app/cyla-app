import React from 'react'
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
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Statistics: undefined
  Profile: undefined
}

const Tab = createMaterialBottomTabNavigator<TabsParamList>()

export default () => {
  const { colors } = useTheme()
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="Daily"
          component={DailyScreen}
          options={{
            tabBarColor: colors.daily,
            tabBarIcon: ({ color }) => <DailyIcon color={color} size={20} />,
            tabBarLabel: 'Today',
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarColor: colors.calendar,
            tabBarIcon: ({ color }) => <CalendarIcon color={color} size={20} />,
            tabBarLabel: 'Calendar',
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            tabBarColor: colors.statistics,
            tabBarIcon: ({ color }) => (
              <StatisticsIcon color={color} size={20} />
            ),
            tabBarLabel: 'Statistics',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={__DEV__ ? ProfileScreen : NYIScreen}
          options={{
            tabBarColor: colors.profile,
            tabBarIcon: ({ color }) => <ProfileIcon color={color} size={20} />,
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </>
  )
}
