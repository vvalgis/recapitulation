import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { emptyFn } from 'libs/utils'

const useDispatchAction = (actionFn, { args = [], deps = null } = {}) => {
  const dispatch = useDispatch()
  return useEffect(() => {
    dispatch(actionFn(...args))
    return emptyFn
  }, deps)
}

export default useDispatchAction
