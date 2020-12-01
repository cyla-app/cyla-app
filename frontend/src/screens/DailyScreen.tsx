import React from 'react'
import { View } from 'react-native'
import { Headline, Text, useTheme } from 'react-native-paper'
import CalendarStrip from '../components/CalendarStrip'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'

type DailyScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Daily'
>

export default ({ navigation }: { navigation: DailyScreenNavigationProp }) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'space-between',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 250,
            height: 250,
            borderRadius: 250 / 2,
            backgroundColor: colors.surface,
            borderStyle: 'solid',
            borderColor: colors.primary,
            borderWidth: 2,
          }}>
          <Text>Period in</Text>
          <Headline>3 days</Headline>
        </View>
      </View>

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
