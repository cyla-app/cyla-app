import React from 'react'

import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'
import {
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import MainStackNavigation from './navigation/MainStackNavigation'
import { StatusBar } from 'react-native'

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
  const { colors } = theme
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.background}
        animated
      />
      <NavigationContainer theme={theme}>
        <MainStackNavigation />
      </NavigationContainer>
    </PaperProvider>
  )
}
export default App
