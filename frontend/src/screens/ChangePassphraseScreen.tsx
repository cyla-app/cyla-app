import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Headline } from 'react-native-paper'
import PasswordChangeForm from '../components/PasswordChangeForm'
import CylaModule from '../modules/CylaModule'
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../navigation/MainStackNavigation'

type ChangePassphraseScreenNavigationProp = StackNavigationProp<MainStackParamList>

type PropType = {
  navigation: ChangePassphraseScreenNavigationProp
}

export default ({ navigation }: PropType) => {
  const [isShowPwdChangeErr, setIsShowPwdChangeErr] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 40,
      }}>
      <Headline style={{ textAlign: 'center' }}>Change Password</Headline>
      <PasswordChangeForm
        onSave={(curPwd, newPwd) => {
          CylaModule.changePwd(curPwd, newPwd)
            .then(() => navigation.goBack())
            .catch((reason) => {
              setIsShowPwdChangeErr(true)
              if (reason.code === '400') {
                setErrorMessage('Incorrect password')
              } else {
                setErrorMessage('Unknown error')
              }
            })
        }}
      />
      {isShowPwdChangeErr ? <Text>{errorMessage}</Text> : null}
    </View>
  )
}
