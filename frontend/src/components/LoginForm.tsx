import * as React from 'react'
import { useRef, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { TextInput as RNTextInput } from 'react-native'

const isPasswordValid = (password: string) => password.length >= 6

const isUsernameValid = (username: string) => username.length >= 4

type LoginFormProps = {
  loading: boolean
  continueName: string
  onSave: (username: string, passphrase: string) => void
}

export default ({ onSave, loading, continueName }: LoginFormProps) => {
  const [username, setUsername] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const passwordInputRef = useRef<RNTextInput | null>(null)

  return (
    <>
      <TextInput
        label="Username"
        value={username}
        mode="outlined"
        onChangeText={(newUsername) => setUsername(newUsername)}
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />
      <TextInput
        ref={passwordInputRef}
        label="Password"
        secureTextEntry
        value={passphrase}
        mode="outlined"
        onChangeText={(newPassword) => setPassphrase(newPassword)}
        onSubmitEditing={() => onSave(username, passphrase)}
      />
      <Button
        loading={loading}
        disabled={!isPasswordValid(passphrase) || !isUsernameValid(username)}
        icon="login"
        style={{
          margin: 20,
        }}
        onPress={() => onSave(username, passphrase)}>
        {continueName}
      </Button>
    </>
  )
}
