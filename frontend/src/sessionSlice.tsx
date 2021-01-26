import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from './App'
import CylaModule from './modules/CylaModule'
import { fetchDuration } from './daysSlice'
import NetInfo from '@react-native-community/netinfo'
import { generateMockData } from './screens/SignUpScreen'

export const checkSignIn = createAsyncThunk<
  { signedIn: boolean },
  void,
  { state: RootState }
>('session/checkSignIn', async (_, thunkAPI) => {
  const state = await NetInfo.fetch()
  const sessionAvailable = await CylaModule.isSessionAvailable()

  if (sessionAvailable && state.isInternetReachable) {
    await CylaModule.reuseLastSession()
    await thunkAPI.dispatch(fetchDuration())
  }
  return { signedIn: sessionAvailable }
})

export const signIn = createAsyncThunk<
  { signedIn: boolean },
  { username: string; passphrase: string },
  { state: RootState }
>('session/signIn', async ({ username, passphrase }, thunkAPI) => {
  const state = await NetInfo.fetch()

  if (state.isInternetReachable) {
    await CylaModule.signIn(username, passphrase)
    await thunkAPI.dispatch(fetchDuration())
    return { signedIn: true }
  }

  return { signedIn: false }
})

export const signUp = createAsyncThunk<
  { signedIn: boolean },
  { username: string; passphrase: string },
  { state: RootState }
>('session/signUp', async ({ username, passphrase }, thunkAPI) => {
  const state = await NetInfo.fetch()

  if (state.isInternetReachable) {
    await CylaModule.signUp(username, passphrase)
    await generateMockData()
    await thunkAPI.dispatch(fetchDuration())
    return { signedIn: true }
  }

  return { signedIn: false }
})

type SessionStateType = {
  loading: boolean
  signedIn: boolean
  signInError?: string
}

const session = createSlice({
  name: 'session',
  initialState: {
    signedIn: false,
  } as SessionStateType,
  reducers: {},
  extraReducers: (builder) => {
    const fulfilledReducer: CaseReducer<
      SessionStateType,
      ReturnType<
        | typeof checkSignIn.fulfilled
        | typeof signIn.fulfilled
        | typeof signUp.fulfilled
      >
    > = (state, action) => {
      return {
        ...state,
        loading: false,
        signedIn: action.payload.signedIn,
      }
    }

    const rejectReducer: CaseReducer<
      SessionStateType,
      ReturnType<
        | typeof checkSignIn.rejected
        | typeof signIn.rejected
        | typeof signUp.rejected
      >
    > = (state, action) => {
      return {
        ...state,
        loading: false,
        signedIn: false,
        signInError: action.error.message,
      }
    }
    const pendingReducer: CaseReducer<
      SessionStateType,
      ReturnType<
        | typeof checkSignIn.pending
        | typeof signIn.pending
        | typeof signUp.pending
      >
    > = (state) => {
      return {
        ...state,
        loading: true,
        signedIn: true,
      }
    }
    builder
      .addCase(checkSignIn.fulfilled, fulfilledReducer)
      .addCase(checkSignIn.rejected, rejectReducer)
      .addCase(checkSignIn.pending, pendingReducer)
      .addCase(signUp.fulfilled, fulfilledReducer)
      .addCase(signUp.rejected, rejectReducer)
      .addCase(signUp.pending, pendingReducer)
      .addCase(signIn.fulfilled, fulfilledReducer)
      .addCase(signIn.rejected, rejectReducer)
      .addCase(signIn.pending, pendingReducer)
  },
})

export const reducer = session.reducer
