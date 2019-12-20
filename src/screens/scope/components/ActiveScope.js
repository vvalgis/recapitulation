import css from './../style.sss'
import React, { Fragment } from 'react'
import { Tasks, NewTaskForm } from './'
import { ScopeTitle } from 'elements'

const ActiveScope = ({ scope, tasks }) => {
  return (
    <section className={ css.scope }>
      <ScopeTitle scope={ scope } isActive />
      <Tasks tasks={ tasks } />
      <footer><NewTaskForm scope={ scope } /></footer>
    </section>
  )
}

export default ActiveScope
