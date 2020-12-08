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

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      buttonBackground: string
    }

    interface Theme {}
  }
}

const theme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: '#79486D',
    accent: '#9E1818',
    surface: '#FFF',
    buttonBackground: 'rgb(217,156,186)',
  },
}

const App = () => {
  const [userKeyReady, setUserKeyReady] = useState(true)

  useEffect(() => {
    const retrieveUserKey = async () => {
      const decryptionService = new DecryptionService()
      const isReady = await decryptionService.isUserKeyReady()

      setUserKeyReady(isReady)

      if (isReady) {
        await decryptionService.setupUserKey()
      }
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
