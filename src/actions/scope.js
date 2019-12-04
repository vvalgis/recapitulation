import { isEmpty } from 'lodash'
import { scope as opScope } from 'operations'
import signals from 'libs/signals'

const init = () => (dispatch, getState) => {
  dispatch(actions.scope.switchTo(opScope.create(getState().db)))
}

const setActive = (currentScope) => (dispatch, getState) => {
  const isActiveScope = opScope.isCurrent(getState().db, currentScope)

  dispatch(signals.activeScopeSet(isActiveScope))
}

const getAround = (scope) => (dispatch, getState) => {
  const { forwardScope, backwardScope } = opScope.findNeighborsFor(getState().db, scope)

  dispatch(signals.forwardScopeRecieved(forwardScope))
  dispatch(signals.backwardScopeRecieved(backwardScope))
}

const getLast = () => (dispatch, getState) => {
  const currentScope = opScope.getLast(getState().db)

  if (isEmpty(currentScope)) {
    dispatch(init())
  } else {
    dispatch(switchTo(currentScope))
  }
}

const switchTo = (scope) => (dispatch, getState) => {
  if (!isEmpty(scope)) {
    dispatch(signals.scopeRecieved(scope))
    dispatch(getAround(scope))
    dispatch(setActive(scope))
  }
}

const recapitulate = () => (dispatch, getState) => {
  const { db, currentScope } = getState()
  const newScope = opScope.recapitulate(db, currentScope)

  dispatch(switchTo(newScope))
}

export {
  getLast,
  switchTo,
  recapitulate
}
