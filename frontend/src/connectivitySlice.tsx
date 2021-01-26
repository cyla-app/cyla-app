import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { filter, map, mergeMap } from 'rxjs/operators'
import { Day } from '../generated'
import {
  from as fromPromise,
  Observable,
  OperatorFunction,
  pipe,
  UnaryFunction,
} from 'rxjs'
import CylaModule from './modules/CylaModule'
import { parseDay } from './utils/date'
import { fetchRange, MyEpic, saveDay } from './daysSlice'
import NetInfo from '@react-native-community/netinfo'

type ConnectivityStateType = {
  online: boolean
}

const connectivity = createSlice({
  name: 'connectivity',
  initialState: {
    online: true,
  } as ConnectivityStateType,
  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        online: action.payload,
      }
    },
  },
})

const inputIsNotNullOrUndefined = <T extends any>(
  input: null | undefined | T,
): input is T => input !== null && input !== undefined

export const isNotNullOrUndefined = <T extends any>() => (
  source$: Observable<null | undefined | T>,
) => source$.pipe(filter(inputIsNotNullOrUndefined))

export const observeConnectivity = (dispatch: Dispatch) =>
  new Observable<boolean | null | undefined>((subscriber) =>
    NetInfo.addEventListener((state) =>
      subscriber.next(state.isInternetReachable),
    ),
  )
    .pipe<boolean>(isNotNullOrUndefined())
    .subscribe((online: boolean) =>
      dispatch(connectivity.actions.setOnline(online)),
    )

export const reducer = connectivity.reducer
