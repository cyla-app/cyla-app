import React from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { Day } from '../types'
import EntryDay from '../components/EntryDay'
import { saveDay } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { formatDay } from '../utils/date'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'
import { Headline } from 'react-native-paper'

type AddScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Add'>,
  StackNavigationProp<MainStackParamList>
>

export default ({}: { navigation: AddScreenNavigationProp }) => {
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  const dispatch = useDispatch()

  const selectedDate = formatDay(new Date())
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignContent: 'flex-end',
          marginBottom: 30,
        }}>
        <Headline>Editing {selectedDate}</Headline>
        <ScrollView contentContainerStyle={{}}>
          <EntryDay
            selectedDate={selectedDate}
            onSave={(day: Day) => {
              dispatch(saveDay(day))
            }}
          />
        </ScrollView>
      </View>
      <DaysErrorSnackbar daysError={daysError} />
    </>
  )
}
