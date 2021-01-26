import * as React from 'react'
import { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'

type LoginFormProps = {
  loading: boolean
  continueName: string
  onSave: (username: string, passphrase: string) => void
}
export default ({ onSave, loading, continueName }: LoginFormProps) => {
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
        loading={loading}
        icon="login"
        style={{
          margin: 20,
        }}
        onPress={() => {
          onSave(username, passphrase)
        }}>
        {continueName}
      </Button>
    </>
  )
}
