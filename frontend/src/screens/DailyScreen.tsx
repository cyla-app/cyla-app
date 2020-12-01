import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import CalendarStrip from '../components/CalendarStrip'
import {
  MainStackParamList,
  TabsParamList,
} from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import PeriodCircle from '../components/PeriodCircle'
import DayDataEntry from '../components/DayDataEntry'

type DailyScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Daily'>,
  StackNavigationProp<MainStackParamList>
>

export default ({ navigation }: { navigation: DailyScreenNavigationProp }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'space-between',
      }}>
      {/*<PeriodCircle />*/}

      <DayDataEntry />

      <CalendarStrip
        onDaySelected={() => {
          navigation.navigate('Add')
        }}
      />

      {/*<FAB*/}
      {/*  style={{*/}
      {/*    position: 'absolute',*/}
      {/*    right: 0,*/}
      {/*    bottom: 0,*/}
      {/*    margin: 16,*/}
      {/*  }}*/}
      {/*  icon="plus"*/}
      {/*  onPress={() => {*/}
      {/*    navigation.navigate('Add', { key: 'Add' })*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  )
}
