import { createSlice, CaseReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from './App'
import CylaModule from './modules/CylaModule'
import { fetchDuration } from './daysSlice'
import NetInfo from '@react-native-community/netinfo'
import { addDays, getDate } from 'date-fns'
import { formatDay } from './utils/date'
import { Bleeding, Mucus } from '../generated'

const generateMockData = async () => {
  const randomDate = (start: Date, end: Date) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )

  const random = randomDate(new Date(2020, 0, 1), new Date(2020, 2, 1))
  for (let i = 0; i < 365; i++) {
    const day = addDays(random, i)
    await CylaModule.saveDay(day, {
      date: formatDay(day),
      bleeding:
        getDate(day) <= 10 && getDate(day) >= 7
          ? {
              strength: Bleeding.strength.STRONG,
            }
          : undefined,
      temperature: {
        value: 36.5 + 0.5 * Math.sin(Math.sin(0.1 * i) * i),
        timestamp: day.toISOString(),
        note: undefined,
      },
      mucus: {
        feeling: Mucus.feeling.DRY,
        texture: Mucus.texture.EGG_WHITE,
      },
    })
  }
}

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
    await generateMockData()
    await thunkAPI.dispatch(fetchDuration())
    return { signedIn: true }
  }

  return { signedIn: false }
})

type SessionStateType = {
  loading: boolean
  signedIn: boolean
  error?: string
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
        signedIn: false,
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

export const reducer = session.reducer
