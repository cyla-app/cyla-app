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
import { TouchableHighlight, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Adding: undefined
  Statistics: undefined
  Profile: undefined
}

const SIZE = 50

const AddButton = () => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 10,
        bottom: 10,
        overflow: 'visible',
      }}>
      <TouchableHighlight
        underlayColor="#2882D8"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: '#48A2F8',
          overflow: 'visible',
        }}>
        <MaterialCommunityIcons size={24} color="#F8F8F8" name={'plus'} />
      </TouchableHighlight>
    </View>
  )
}

const Tab = createMaterialBottomTabNavigator<TabsParamList>()

export default () => {
  const { colors } = useTheme()
  return (
    <>
      <Tab.Navigator barStyle={{ paddingTop: 100, overflow: 'visible' }}>
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
          name="Adding"
          component={() => null}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({}) => <AddButton />,
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
