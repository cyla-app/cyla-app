import CylaModule from '../modules/CylaModule'
import React, { useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import PasswordEntry from '../components/PasswordEntry'
import { ActivityIndicator } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { generateMockData } from '../daysSlice'

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

  const setup = async (passphrase: string) => {
    setLoading(true)
    try {
      await CylaModule.setupUserKey(passphrase)
      await generateMockData()

      setLoading(false)
      onSignIn()
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <View style={containerStyle}>
      <PasswordEntry
        onSave={(passphrase: string) => {
          setup(passphrase)
        }}
      />
    </View>
  )
}
