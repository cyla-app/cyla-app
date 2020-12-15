import React from 'react'
import { Alert, View } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import DayDataEntry from '../components/DayDataEntry'
import { TabsParamList } from '../navigation/TabBarNavigation'
import DecryptionService from '../decryption/DecryptionService'

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

      <DayDataEntry
        onAdd={(day) => {
          new DecryptionService()
            .postDay(day)
            .catch((e: Error) => Alert.alert(e.message))
        }}
      />

      <CalendarStrip
        onDaySelected={() => {
          // navigation.navigate('Add')
        }}
      />
    </View>
  )
}
