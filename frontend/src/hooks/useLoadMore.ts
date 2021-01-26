import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../App'
import { useCallback } from 'react'
import { fetchDuration } from '../daysSlice'

const useLoadMore = (): [boolean, () => void] => {
  const dispatch = useDispatch()
  const loading = useSelector<RootState, boolean>((state) => state.days.loading)

  return [
    loading,
    useCallback(() => {
      dispatch(fetchDuration())
    }, [dispatch]),
  ]
}

export default useLoadMore
