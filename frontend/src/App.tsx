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
import { reducer as connectivityReducer } from './connectivitySlice'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { observeConnectivity } from './connectivitySlice'

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      buttonBackground: string
      periodRed: string
      daily: string
      calendar: string
      add: string
      statistics: string
      profile: string
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
    primary: '#00075E',
    accent: '#CC1C21',
    surface: '#ffeded',
    // surface: '#FFF',
    background: '#ffeded',
    // background: '#FFF',
    backdrop: '#000000',
    onSurface: '#ac959c',
    periodRed: '#CC1C21',
    buttonBackground: 'rgb(239,228,237)',
    daily: '#00075E',
    calendar: 'rgb(0,8,114)',
    add: 'rgb(0,10,133)',
    statistics: 'rgb(0,11,153)',
    profile: 'rgb(0,13,172)',
  },
}

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootState>()

const rootReducer = combineReducers({
  days: daysReducer,
  session: sessionReducer,
  connectivity: connectivityReducer,
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
observeConnectivity(store.dispatch)

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
