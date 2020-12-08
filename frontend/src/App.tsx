import React, { useEffect, useState } from 'react'

import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'
import {
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import MainStackNavigation from './navigation/MainStackNavigation'
import PasswordModal from './components/PasswordModal'
import DecryptionService from './decryption/DecryptionService'

const theme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: '#79486D',
    accent: '#9E1818',
  },
}

const App = () => {
  const [userKeyReady, setUserKeyReady] = useState(true)

  useEffect(() => {
    const retrieveUserKey = async () => {
      setUserKeyReady(await new DecryptionService().isUserKeyReady())
    }

    retrieveUserKey().catch((e) => {
      console.error(e)
    })
  }, [])

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        {!userKeyReady && (
          <PasswordModal
            onSave={(passphrase: string) => {
              new DecryptionService().setupUserKey(passphrase)
            }}
          />
        )}
        <MainStackNavigation />
      </NavigationContainer>
    </PaperProvider>
  )
}
export default App
