import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import * as actions from 'actions'
import { getFromCompartment } from 'libs/store'
import { Button, Icon } from 'elements'

const ScopeNavigateButton = ({ scope, direction }) => {
  const dispatch = useDispatch()
  const nextScope = useSelector(getFromCompartment(`${direction}Scope`), [scope])
  const buttonName = direction === 'backward' ? 'left' : 'right'
  const switchScope = () => {
    dispatch(actions.scope.switchTo(nextScope))
  }

  return isEmpty(nextScope) ? '' : <Button name={ buttonName } onClick={ switchScope }><Icon name={ buttonName } /></Button>
}

export default ScopeNavigateButton
