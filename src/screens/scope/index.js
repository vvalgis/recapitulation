import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import CN from 'classnames'
import { isScopesEqual } from 'libs/utils'
import { getFromCompartment } from 'libs/store'
import { Scope, ActiveScope, ArchiveScope } from './components'
import { CommonScreenLayout } from 'layouts'

import { InitScopeScreen, SettingsScreen } from 'screens'

const layoutOptions = (isActive) => {
  return {
    screenTitle: '',
    leftNav: isActive ? ['sync'] : [],
    rightNav: ['settings']
  }
}

const ScopeScreen = () => {
  const scope = useSelector(getFromCompartment('currentScope'), isScopesEqual)
  const isActive = useSelector(getFromCompartment('isActiveScope'))
  if (isEmpty(scope)) {
    return <InitScopeScreen />
  } else {
    const ScopeComponent = isActive ? ActiveScope : ArchiveScope
    const scopeClassName = CN({ active: isActive, archive: !isActive })

    return (
      <CommonScreenLayout { ...layoutOptions(isActive) }>
        <Scope { ...{ scope, ScopeComponent, className: scopeClassName } } />
      </CommonScreenLayout>
    )
  }
}

export default ScopeScreen
