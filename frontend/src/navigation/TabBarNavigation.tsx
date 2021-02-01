import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import NYIScreen from '../screens/NYIScreen'
import ProfileScreen from '../screens/ProfileScreen'
import { BottomNavigation, useTheme } from 'react-native-paper'
import StatisticsScreen from '../screens/StatisticsScreen'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { Link, TabActions } from '@react-navigation/native'
import { Platform, StyleSheet } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CalendarIcon from './icons/CalendarIcon'
import StatisticsIcon from './icons/StatisticsIcon'
import ProfileIcon from './icons/ProfileIcon'
import DailyIcon from './icons/DailyIcon'
// import BottomNavigation from './BottomNavigation'

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Statistics: undefined
  Profile: undefined
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
  touchable: {
    display: 'flex',
    justifyContent: 'center',
  },
})
type Scene = { route: { key: string } }

const Tab = createBottomTabNavigator<TabsParamList>()

export default () => {
  const { colors } = useTheme()
  const theme = useTheme()
  return (
    <>
      <Tab.Navigator
        tabBar={({ state, descriptors, navigation }) => {
          return (
            <BottomNavigation
              theme={theme}
              navigationState={state}
              onIndexChange={(index: number) =>
                navigation.dispatch({
                  ...TabActions.jumpTo(state.routes[index].name),
                  target: state.key,
                })
              }
              renderScene={({ route }) => descriptors[route.key].render()}
              renderIcon={({ route, focused, color }) => {
                const { options } = descriptors[route.key]

                if (typeof options.tabBarIcon === 'string') {
                  return (
                    <MaterialCommunityIcons
                      name={options.tabBarIcon}
                      color={color}
                      size={24}
                      style={styles.icon}
                    />
                  )
                }

                if (typeof options.tabBarIcon === 'function') {
                  return options.tabBarIcon({ focused, color })
                }

                return null
              }}
              getLabelText={({ route }: { route: Scene }) => {
                const { options } = descriptors[route.key]

                return options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : (route as Route<string>).name
              }}
              getColor={({ route }) =>
                descriptors[route.key].options.tabBarColor
              }
              getBadge={({ route }) =>
                descriptors[route.key].options.tabBarBadge
              }
              getAccessibilityLabel={({ route }) =>
                descriptors[route.key].options.tabBarAccessibilityLabel
              }
              getTestID={({ route }) =>
                descriptors[route.key].options.tabBarTestID
              }
              onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })

                if (event.defaultPrevented) {
                  preventDefault()
                }
              }}
            />
          )
        }}>
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
