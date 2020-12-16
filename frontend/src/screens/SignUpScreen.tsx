import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import PasswordEntry from '../components/PasswordEntry'
import { ActivityIndicator } from 'react-native-paper'

export default ({ onSignIn }: { onSignIn: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return <Text>{error}</Text>
  }

  if (loading) {
    return <ActivityIndicator animating={true} />
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  } as ViewStyle

  return (
    <View style={containerStyle}>
      <PasswordEntry
        onSave={(passphrase: string) => {
          setLoading(true)
          CylaModule.setupUserKey(passphrase)
            .then(() => {
              setLoading(false)
              onSignIn()
            })
            .catch((e: Error) => {
              setError(e.message)
              setLoading(false)
            })
        }}
      />
    </View>
  )
}
