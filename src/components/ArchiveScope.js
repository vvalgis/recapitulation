import React, { Fragment } from 'react'
import { Tasks } from 'components'
import { SettingsButton, ScopeTitle } from 'elements'

const ArchiveScope = ({ scope, tasks }) => {
  return (
    <Fragment>
      <nav><SettingsButton /></nav>
      <ScopeTitle scope={ scope } />
      <Tasks tasks={ tasks } isArchivedScope />
      <footer></footer>
    </Fragment>
  )
}

export default ArchiveScope
