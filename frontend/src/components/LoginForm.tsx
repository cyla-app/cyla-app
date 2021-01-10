import * as React from 'react'
import { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'

type LoginFormProps = {
  onSave: (username: string, passphrase: string) => void
}
export default ({ onSave }: LoginFormProps) => {
  const [username, setUsername] = useState('')
  const [passphrase, setPassphrase] = useState('')

  return (
    <>
      <TextInput
        label="Username"
        value={username}
        mode="outlined"
        onChangeText={(newUsername) => setUsername(newUsername)}
      />
      <TextInput
        label="Password"
        secureTextEntry
        value={passphrase}
        mode="outlined"
        onChangeText={(newPassword) => setPassphrase(newPassword)}
      />
      <Button
        icon="content-save"
        style={{
          margin: 20,
        }}
        onPress={() => {
          onSave(username, passphrase)
        }}>
        Save
      </Button>
    </>
  )
}