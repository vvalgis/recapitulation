import React from 'react'
import { useDispatchAction } from 'libs/hooks'
import * as actions from 'actions'
import { LoadingScreen } from 'screens'

const InitScopeScreen = () => {
  useDispatchAction(actions.scope.getLast)

  return <LoadingScreen />
}

export default InitScopeScreen
