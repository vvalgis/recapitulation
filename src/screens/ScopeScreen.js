import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { isScopesEqual } from 'main'
import { getFromCompartment } from 'reducers'
import { Screen, Scope, ActiveScope, ArchiveScope } from 'components'

import { InitScopeScreen, SettingsScreen } from 'screens'

const ScopeScreen = () => {
  const scope = useSelector(getFromCompartment('currentScope'), isScopesEqual)
  const isActive = useSelector(getFromCompartment('isActiveScope'))
  if (isEmpty(scope)) {
    return <InitScopeScreen />
  } else {
    const ScopeComponent = isActive ? ActiveScope : ArchiveScope
    const scopeClassName = isActive ? 'active' : 'archive'

    return <Screen className={ `scope ${ scopeClassName }` }><Scope { ...{ scope, ScopeComponent } } /></Screen>
  }
}

export default ScopeScreen
