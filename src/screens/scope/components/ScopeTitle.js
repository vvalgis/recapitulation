import React, { useMemo } from 'react'
import { formatScopeDate } from 'libs/utils'
import { ScopeNavigateButton, RecapitulateButton } from 'elements'

const ScopeTitle = ({ scope, isActive = false }) => {
  const formattedDate = useMemo(() => formatScopeDate(scope.created_at), [scope.created_at])

  return (
    <header>
      <span><ScopeNavigateButton scope={ scope } direction="backward" /></span>
      <h1>{ formattedDate }</h1>
      <span>
        <ScopeNavigateButton scope={ scope } direction="forward" />
        { isActive ? <RecapitulateButton /> : '' }
      </span>
    </header>
  )
}

export default ScopeTitle
