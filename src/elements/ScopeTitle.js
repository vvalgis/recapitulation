import React, { useMemo } from 'react'
import { formatScopeDate } from 'main'
import { ScopeNavigateButton, RecapitulateButton } from 'elements'

const ScopeTitle = ({ scope, isActive = false }) => {
  const formattedDate = useMemo(() => formatScopeDate(scope.created_at), [scope.created_at])

  return (
    <header>
      <ScopeNavigateButton scope={ scope } direction="backward" />
      <h1>{ formattedDate }</h1>
      <ScopeNavigateButton scope={ scope } direction="forward" />
      { isActive ? <RecapitulateButton /> : '' }
    </header>
  )
}

export default ScopeTitle
