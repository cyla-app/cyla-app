import React from 'react'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import ProfileScreen from '../screens/ProfileScreen'
import { TouchableRipple, useTheme } from 'react-native-paper'
import StatisticsScreen from '../screens/StatisticsScreen'

import { Dimensions, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CalendarIcon from './icons/CalendarIcon'
import StatisticsIcon from './icons/StatisticsIcon'
import ProfileIcon from './icons/ProfileIcon'
import DailyIcon from './icons/DailyIcon'

import createMaterialBottomTabNavigator from './tabview/createMaterialBottomTabNavigator'
import { useNavigation } from '@react-navigation/native'
import AddScreen from '../screens/AddScreen'
import { useKeyboardStatus } from '../hooks/useKeyboardStatus'
const SIZE = 55

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Add_Dummy: undefined
  Statistics: undefined
  Profile: undefined
  Sharing: undefined
}

const AddButton = () => {
  const navigation = useNavigation()
  const isOpen = useKeyboardStatus()

  const { colors } = useTheme()
  return isOpen ? null : (
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        left: Dimensions.get('window').width / 2 - SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableRipple
        borderless
        onPress={() => navigation.navigate('Add', {})}
        rippleColor="rgba(0, 0, 0, .32)"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: colors.primary,
        }}>
        <View>
          <MaterialCommunityIcons name={'plus'} color={'#fff'} size={24} />
        </View>
      </TouchableRipple>
    </View>
  )
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
          name="Add_Dummy"
          component={AddScreen}
          options={{
            tabBarColor: colors.add,
            tabBarIcon: () => null,
            tabBarLabel: 'Add',
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
          component={ProfileScreen}
          options={{
            tabBarColor: colors.profile,
            tabBarIcon: ({ color }) => <ProfileIcon color={color} size={20} />,
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
      <AddButton />
    </>
  )
}
