import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatchAction } from 'main'
import * as actions from 'actions'
import { getFromCompartment } from 'libs/store'

const Scope = ({ scope, ScopeComponent }) => {
  useDispatchAction(actions.task.getByScope, { args: [scope], deps: [scope] })
  const tasks = useSelector(getFromCompartment('currentTasks'))

  return <ScopeComponent { ...{ scope, tasks } } />
}

export default Scope
