import * as React from 'react'
import { useRef, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { TextInput as RNTextInput } from 'react-native'

const isPasswordValid = (password: string) => password.length >= 6

const isUsernameValid = (username: string) => username.length >= 4

type LoginFormProps = {
  loading: boolean
  continueName: string
  repeatPassphrase: boolean
  onSave: (username: string, passphrase: string) => void
}

export default ({
  onSave,
  loading,
  continueName,
  repeatPassphrase,
}: LoginFormProps) => {
  const [username, setUsername] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [checkPassphrase, setCheckPassphrase] = useState('')

  const passphraseInputRef = useRef<RNTextInput | null>(null)
  const checkPassphraseInputRef = useRef<RNTextInput | null>(null)

  return (
    <>
      <TextInput
        label="Username"
        value={username}
        mode="outlined"
        onChangeText={(newUsername) => setUsername(newUsername)}
        onSubmitEditing={() => passphraseInputRef.current?.focus()}
      />
      <TextInput
        ref={passphraseInputRef}
        label="Password"
        secureTextEntry
        value={passphrase}
        mode="outlined"
        onChangeText={(newPassword) => setPassphrase(newPassword)}
        onSubmitEditing={() =>
          repeatPassphrase
            ? checkPassphraseInputRef.current?.focus()
            : onSave(username, passphrase)
        }
      />
      {repeatPassphrase ? (
        <TextInput
          ref={checkPassphraseInputRef}
          label="Reenter Password"
          secureTextEntry
          value={checkPassphrase}
          mode="outlined"
          onChangeText={(newPassword) => setCheckPassphrase(newPassword)}
          onSubmitEditing={() => onSave(username, passphrase)}
        />
      ) : null}
      <Button
        loading={loading}
        disabled={
          !isPasswordValid(passphrase) ||
          !isUsernameValid(username) ||
          (repeatPassphrase && checkPassphrase !== passphrase)
        }
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
