import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import DailyScreen from '../screens/DailyScreen'
import CalendarScreen from '../screens/CalendarScreen'
import NYIScreen from '../screens/NYIScreen'
import DailyIcon from './icons/DailyIcon'
import CalendarIcon from './icons/CalendarIcon'
import StatisticsIcon from './icons/StatisticsIcon'
import ProfileIcon from './icons/ProfileIcon'
import AnimatedTabBar, {
  BubbleTabBarItemConfig,
  TabsConfig,
} from '@gorhom/animated-tabbar'

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Statistics: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabsParamList>()

const tabs: TabsConfig<BubbleTabBarItemConfig, TabsParamList> = {
  Daily: {
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      component: DailyIcon,
      activeColor: 'rgba(91,55,183,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(223,215,243,1)',
      inactiveColor: 'rgba(223,215,243,0)',
    },
  },
  Calendar: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: CalendarIcon,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
  Statistics: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: StatisticsIcon,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
  Profile: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: ProfileIcon,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
}

export default () => {
  return (
    <>
      <Tab.Navigator
        tabBar={(props) => {
          // @ts-ignore I'm unable to fix this right now
          return <AnimatedTabBar iconSize={20} tabs={tabs} {...props} />
        }}>
        <Tab.Screen name="Daily" component={DailyScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Statistics" component={NYIScreen} />
        <Tab.Screen name="Profile" component={NYIScreen} />
      </Tab.Navigator>
    </>
  )
}
