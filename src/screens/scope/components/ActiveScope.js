import css from './../style.sss'
import React, { Fragment } from 'react'
import { Tasks, NewTask, ScopeTitle } from './'

const ActiveScope = ({ scope, tasks }) => {
  return (
    <section className={ css.scope }>
      <ScopeTitle scope={ scope } isActive />
      <Tasks tasks={ tasks } />
      <footer><NewTask scope={ scope } /></footer>
    </section>
  )
}

export default ActiveScope
