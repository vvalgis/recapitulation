import React from 'react'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'
import { Button, Icon } from 'elements'

const RecapitulateButton = () => {
  const dispatch = useDispatch()
  const submitRecapitulation = () => {
    dispatch(actions.scope.recapitulate())
  }

  return (
    <Button name="recap" title="Recapitulate" onClick={ submitRecapitulation }><Icon name="recap" /></Button>
  )
}

export default RecapitulateButton
