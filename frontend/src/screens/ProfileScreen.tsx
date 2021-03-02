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
  const [loading, refresh] = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    const getUserId = async () => {
      setUserId(await CylaModule.getUserId())
    }

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
      <Button
        icon={'wrench'}
        onPress={async () => {
          navigation.navigate('ChangePassphrase')
        }}>
        Change Password
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
