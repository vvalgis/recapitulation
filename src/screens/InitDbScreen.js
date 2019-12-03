import React from 'react'
import { useDispatchAction } from 'main'
import * as actions from 'actions'
import { LoadingScreen } from 'screens'

const InitDbScreen = () => {
  useDispatchAction(actions.db.loadFile, { deps: [] })

  return <LoadingScreen />
}

export default InitDbScreen
