import React from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { TabsParamList } from '../navigation/TabBarNavigation'
import { Day } from '../../generated'
import EntryDay from '../components/EntryDay'
import { saveDay } from '../daysSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { formatDay } from '../utils/date'
import useRefresh from '../hooks/useRefresh'
import DaysErrorSnackbar from '../components/DaysErrorSnackbar'

type AddScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, 'Add'>,
  StackNavigationProp<MainStackParamList>
>

export default ({}: { navigation: AddScreenNavigationProp }) => {
  const [loading, refresh] = useRefresh()
  const daysError = useSelector<RootState, string | undefined>(
    (state) => state.days.error,
  )
  const dispatch = useDispatch()

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignContent: 'flex-end',
          marginBottom: 30,
        }}>
        <ScrollView
          contentContainerStyle={{}}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }>
          <EntryDay
            selectedDate={formatDay(new Date())}
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
