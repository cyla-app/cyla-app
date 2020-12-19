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
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import daysSlice from './daysSlice'
import profileSlice from './profileSlice'

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      buttonBackground: string
      periodRed: string
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
    periodRed: '#9E1818',
    buttonBackground: 'rgb(239,228,237)',
  },
}

const rootReducer = combineReducers({
  days: daysSlice,
  profile: profileSlice,
})

export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
  reducer: rootReducer,
})

const App = () => {
  const { colors } = theme

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={colors.background}
        animated
      />
      <Provider store={store}>
        <NavigationContainer theme={theme}>
          <MainStackNavigation />
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  )
}
export default App
