import React from 'react'
import { useDispatchAction } from 'libs/hooks'
import * as actions from 'actions'
import { LoadingAppLayout } from 'layouts'
import { Icon } from 'elements'

const InitDbScreen = () => {
  useDispatchAction(actions.db.loadFile, { deps: [] })

  return (
    <LoadingAppLayout>
      <Icon name="loading" />
    </LoadingAppLayout>
  )
}

export default InitDbScreen
