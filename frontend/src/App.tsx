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
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import { epic as daysEpic, reducer as daysReducer } from './daysSlice'
import { reducer as sessionReducer } from './sessionSlice'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      buttonBackground: string
      periodRed: string
      daily: string
      calendar: string
      statistics: string
      profile: string
      statisticsPositive: string
      statisticsNegative: string
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
    backdrop: '#000000',
    onSurface: '#79486D',
    periodRed: '#9E1818',
    buttonBackground: 'rgb(239,228,237)',
    daily: 'rgb(96,72,121)',
    calendar: 'rgb(121,72,97)',
    statistics: 'rgb(97,121,72)',
    profile: 'rgb(72,121,96)',
    statisticsPositive: 'rgb(97,121,72)',
    statisticsNegative: 'rgb(72,97,121)',
  },
}

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootState>()

const rootReducer = combineReducers({
  days: daysReducer,
  session: sessionReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const middlewares = []

if (__DEV__) {
  const createDebugger = require('redux-flipper').default
  middlewares.push(createDebugger())
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      thunk: true,
    }),
    epicMiddleware,
  ],
  enhancers: [applyMiddleware(...middlewares)],
})

epicMiddleware.run(combineEpics(daysEpic))

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
