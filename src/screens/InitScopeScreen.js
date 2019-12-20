import React from 'react'
import { useDispatchAction } from 'libs/hooks'
import * as actions from 'actions'
import { LoadingAppLayout } from 'layouts'
import { Icon } from 'elements'


const InitScopeScreen = () => {
  useDispatchAction(actions.scope.getLast)

  return (
    <LoadingAppLayout>
      <Icon name="loading" />
    </LoadingAppLayout>
  )
}

export default InitScopeScreen
