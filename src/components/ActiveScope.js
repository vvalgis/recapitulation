import React, { Fragment } from 'react'
import { Tasks, NewTaskForm } from 'components'
import { SyncButton, SettingsButton, ScopeTitle } from 'elements'

const ActiveScope = ({ scope, tasks }) => {
  return (
    <Fragment>
      <ScopeTitle scope={ scope } isActive />
      <Tasks tasks={ tasks } />
      <footer><NewTaskForm scope={ scope } /></footer>
    </Fragment>
  )
}

export default ActiveScope
