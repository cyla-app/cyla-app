import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from './App'
import CylaModule from './modules/CylaModule'
import { fetchDuration, resetDays } from './daysSlice'
import NetInfo from '@react-native-community/netinfo'
import { generateMockData } from './utils/mockData'

export const checkSignIn = createAsyncThunk<
  { signedIn: boolean },
  void,
  { state: RootState }
>('session/checkSignIn', async (_, thunkAPI) => {
  const state = await NetInfo.fetch()
  const sessionAvailable = await CylaModule.isSessionAvailable()
  if (sessionAvailable) {
    if (state.isInternetReachable) {
      await CylaModule.setupUserAndSession()
      await thunkAPI.dispatch(fetchDuration())
    } else {
      await CylaModule.loadUser()
    }
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
    generateMockData(thunkAPI.dispatch)
    await thunkAPI.dispatch(fetchDuration())
    return { signedIn: true }
  }

  return { signedIn: false }
})

export const logout = createAsyncThunk<void, void, { state: RootState }>(
  'session/logout',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(resetDays())
    thunkAPI.dispatch(logoutSession())
    await CylaModule.logout()
    return
  },
)

export enum SessionStatus {
  UNKNOWN = 1,
  SIGNED_IN = 2,
  SIGNED_OUT = 3,
}

type SessionStateType = {
  loading: boolean
  status: SessionStatus
  error?: string
}

const initialState: SessionStateType = {
  loading: false,
  status: SessionStatus.UNKNOWN,
}

const session = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    logout: () => ({
      loading: false,
      status: SessionStatus.SIGNED_OUT,
    }),
  },
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
        status: action.payload.signedIn
          ? SessionStatus.SIGNED_IN
          : SessionStatus.SIGNED_OUT,
        error: undefined,
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
        status: SessionStatus.UNKNOWN,
        error: action.error.message,
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

export const logoutSession = session.actions.logout

export const reducer = session.reducer
