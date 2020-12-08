import React from 'react'
import { View } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import DayDataEntry from '../components/DayDataEntry'
import DecryptionService from '../decryption/DecryptionService'
import { TabsParamList } from '../navigation/TabBarNavigation'

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
