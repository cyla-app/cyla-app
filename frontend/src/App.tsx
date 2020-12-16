import React, { useCallback, useState } from 'react'

import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'
import {
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import MainStackNavigation from './navigation/MainStackNavigation'
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './slices'

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
    backdrop: '#000',
    buttonBackground: 'rgb(239,228,237)',
  },
}

const App = () => {
  const { colors } = theme
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true)

    const wait = (timeout: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, timeout)
      })
    }

    wait(2000).then(() => setRefreshing(false))
  }, [])

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.background}
        animated
      />
      <Provider store={store}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <NavigationContainer theme={theme}>
            <MainStackNavigation />
          </NavigationContainer>
        </ScrollView>
      </Provider>
    </PaperProvider>
  )
}
export default App
