import * as React from 'react'
import { useRef, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { Text } from 'react-native'

const isPasswordValid = (password: string) => password.length >= 6

type PasswordChangeFormProps = {
  onSave: (currPassword: string, newPassword: string) => void
}

export default ({ onSave }: PasswordChangeFormProps) => {
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatedNewPassword, setRepeatedNewPassword] = useState('')

  const isDataValid =
    isPasswordValid(currPassword) &&
    isPasswordValid(newPassword) &&
    repeatedNewPassword === newPassword

  return (
    <>
      <TextInput
        label="Password"
        value={currPassword}
        secureTextEntry
        mode="outlined"
        onChangeText={(pwd) => setCurrPassword(pwd)}
      />
      <TextInput
        label="New Password"
        value={newPassword}
        secureTextEntry
        mode="outlined"
        onChangeText={(pwd) => setNewPassword(pwd)}
      />
      <TextInput
        label="Confirm new Password"
        value={repeatedNewPassword}
        secureTextEntry
        mode="outlined"
        onChangeText={(pwd) => setRepeatedNewPassword(pwd)}
      />
      {newPassword &&
      repeatedNewPassword &&
      repeatedNewPassword !== newPassword ? (
        <Text>New Password must match</Text>
      ) : null}
      <Button
        disabled={!isDataValid}
        mode="contained"
        icon="login"
        style={{
          margin: 20,
        }}
        onPress={() => onSave(currPassword, newPassword)}>
        Change password
      </Button>
    </>
  )
}
