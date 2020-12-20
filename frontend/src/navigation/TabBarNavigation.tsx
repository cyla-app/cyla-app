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
  MaterialTabBarItemConfig,
  TabsConfig,
} from '@gorhom/animated-tabbar'
import ProfileScreen from '../screens/ProfileScreen'
import { useTheme } from 'react-native-paper'
import StatisticsScreen from '../screens/StatisticsScreen'

export type TabsParamList = {
  Daily: undefined
  Calendar: undefined
  Statistics: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabsParamList>()

export default () => {
  const { colors } = useTheme()

  const tabs: TabsConfig<MaterialTabBarItemConfig, TabsParamList> = {
    Daily: {
      icon: {
        component: DailyIcon,
        color: colors.surface,
      },
      ripple: {
        color: colors.daily,
      },
    },
    Calendar: {
      icon: {
        component: CalendarIcon,
        color: colors.surface,
      },
      ripple: {
        color: colors.calendar,
      },
    },
    Statistics: {
      icon: {
        component: StatisticsIcon,
        color: colors.surface,
      },
      ripple: {
        color: colors.statistics,
      },
    },
    Profile: {
      icon: {
        component: ProfileIcon,
        color: colors.surface,
      },
      ripple: {
        color: colors.profile,
      },
    },
  }

  return (
    <>
      <Tab.Navigator
        tabBar={({ state, descriptors, navigation }) => {
          return (
            <AnimatedTabBar
              preset="material"
              iconSize={20}
              itemOuterSpace={2}
              itemInnerSpace={4}
              style={{ paddingTop: 5, paddingBottom: 10 }}
              animation={'iconWithLabelOnFocus'}
              tabs={tabs}
              state={state}
              descriptors={descriptors}
              navigation={navigation}
            />
          )
        }}>
        <Tab.Screen name="Daily" component={DailyScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} />
        <Tab.Screen
          name="Profile"
          component={__DEV__ ? ProfileScreen : NYIScreen}
        />
      </Tab.Navigator>
    </>
  )
}
