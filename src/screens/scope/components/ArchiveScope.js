import css from './../style.sss'
import React, { Fragment } from 'react'
import { Tasks, ScopeTitle } from './'

const ArchiveScope = ({ scope, tasks }) => {
  return (
    <section className={ css.scope }>
      <ScopeTitle scope={ scope } />
      <Tasks tasks={ tasks } isArchivedScope />
      <footer></footer>
    </section>
  )
}

export default ArchiveScope
