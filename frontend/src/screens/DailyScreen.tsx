import React from 'react'
import { Alert, ScrollView, View } from 'react-native'
import CalendarStrip from '../components/CalendarStrip'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import CylaModule from '../decryption/CylaModule'
import { Day } from '../../generated'
import EntryDay from '../components/EntryDay'

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
        alignContent: 'flex-end',
      }}>
      {/*<PeriodCircle />*/}

      <ScrollView
        style={{
          flex: 1,
        }}>
        <EntryDay
          onSave={(day: Day) => {
            CylaModule.postDay(day).catch((e: Error) => Alert.alert(e.message))
          }}
        />
      </ScrollView>

      <CalendarStrip
        onDaySelected={() => {
          // navigation.navigate('Add')
        }}
      />
    </View>
  )
}
