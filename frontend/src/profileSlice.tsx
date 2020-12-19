import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit'

type StateType = {
  signedIn: boolean
}

const setSignedInReducer: CaseReducer<StateType, PayloadAction<boolean>> = (
  state,
  action,
) => ({ ...state, signedIn: action.payload })

const profile = createSlice({
  name: 'profile',
  initialState: {
    signedIn: false,
  },
  reducers: {
    setSignedIn: setSignedInReducer,
  },
})

export const { setSignedIn } = profile.actions

export default profile.reducer
