import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import * as actions from 'actions'
import { getFromCompartment } from 'libs/store'
import { Button, Icon } from 'elements'

const SyncButton = () => {
  const dispatch = useDispatch()
  const db = useSelector(getFromCompartment('db'))
  const submitDbSync = () => {
    dispatch(actions.db.syncFile(db))
  }

  return <Button name="sync" title="Sync with the cloud" onClick={ submitDbSync }><Icon name="sync" /></Button>
}

export default SyncButton
