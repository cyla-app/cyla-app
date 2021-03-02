import React from 'react'
import { View } from 'react-native'
import { Headline } from 'react-native-paper'
import PasswordChangeForm from '../components/PasswordChangeForm'

export default () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 40,
      }}>
      <Headline style={{ textAlign: 'center' }}>Change Password</Headline>
      <PasswordChangeForm
        onSave={(cur, newPwd) => {
          console.log(cur, newPwd)
          throw new Error('not implemented')
        }}
      />
    </View>
  )
}
