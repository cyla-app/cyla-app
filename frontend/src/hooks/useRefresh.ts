import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { useCallback } from 'react'
import { fetchRange, Range } from '../daysSlice'

const useRefresh = (): [boolean, () => void] => {
  const dispatch = useDispatch()
  const range = useSelector<RootState, Range | null>(
    (state) => state.days.range,
  )
  const loading = useSelector<RootState, boolean>((state) => state.days.loading)

  return [
    loading,
    useCallback(() => {
      if (range) {
        dispatch(
          fetchRange({
            from: range.from,
            to: range.to,
          }),
        )
      }
    }, [dispatch, range]),
  ]
}

export default useRefresh
