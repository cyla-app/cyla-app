import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import CylaModule from '../modules/CylaModule'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { ActivityIndicator, Button, Headline } from 'react-native-paper'
import useRefresh from '../hooks/useRefresh'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logout } from '../sessionSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'

type ProfileScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SignIn'
>

type PropType = {
  navigation: ProfileScreenNavigationProp
}

export default ({ navigation }: PropType) => {
  const [userId, setUserId] = useState<string>('')
  const daysLoaded = useSelector<RootState, number>(
    (state) => Object.keys(state.days.byDay).length,
  )
  const [realName, setRealName] = useState<string | null>('')
  const [loading, refresh] = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await CylaModule.getUserId())
    }

    const getRealName = async () => {
      setRealName(await AsyncStorage.getItem('realName'))
    }

    getRealName()
    getUserId()
  }, [])

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <ScrollView
      scrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
      }}>
      <Headline>{realName ? `Hello, ${realName}!` : 'Hello!'}</Headline>
      <Button
        icon={'wrench'}
        onPress={async () => {
          const name = 'Mary Garcia'
          setRealName(name)
          await AsyncStorage.setItem('realName', name)
        }}>
        Set your name
      </Button>
      <Button
        icon={'logout'}
        onPress={async () => {
          dispatch(logout())
        }}>
        Logout
      </Button>
      {__DEV__ ? (
        <View>
          <Text>User Id: {userId}</Text>
          <Text>Days Loaded: {daysLoaded}</Text>
        </View>
      ) : null}
      <Button
        icon={'wrench'}
        onPress={() => {
          navigation.navigate('Share')
        }}>
        Share
      </Button>
    </ScrollView>
  )
}
