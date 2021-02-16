import React, { useState } from 'react'
import { View } from 'react-native'
import { MainStackParamList } from '../navigation/MainStackNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Headline, TextInput } from 'react-native-paper'
import CylaModule from '../modules/CylaModule'

type ServerChangeNavigationProp = StackNavigationProp<
  MainStackParamList,
  'ServerChange'
>
export default ({ navigation }: { navigation: ServerChangeNavigationProp }) => {
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    'https://api.cyla.app:443',
  )
  return (
    <>
      <View
        style={{
          flex: 1,
          alignContent: 'flex-end',
          padding: 20,
        }}>
        <Headline>Change Server URL</Headline>
        <TextInput
          mode="outlined"
          value={apiBaseUrl}
          onChangeText={(newApiBaseUrl) => setApiBaseUrl(newApiBaseUrl)}
          onSubmitEditing={async () => {
            await CylaModule.setApiBaseUrl(apiBaseUrl)
            navigation.pop()
          }}
        />
        <Button
          mode="contained"
          style={{
            margin: 20,
          }}
          onPress={async () => {
            await CylaModule.setApiBaseUrl(apiBaseUrl)
            navigation.pop()
          }}>
          Change Server
        </Button>
      </View>
    </>
  )
}
