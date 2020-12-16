import * as React from 'react'
import { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'

export default ({ onSave }: { onSave: (passphrase: string) => void }) => {
  const [passphrase, setPassphrase] = useState('')

  return (
    <>
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
          onSave(passphrase)
        }}>
        Save
      </Button>
    </>
  )
}
