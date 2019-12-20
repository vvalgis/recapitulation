import css from './../style.sss'
import React from 'react'
import CN from 'classnames'

const ArchivedTask = ({ task: { status, note }, statusNames }) => {
  return (
    <li>
      <span className={ css.leftButtons }></span>
      <span className={ CN(css.task, css[statusNames[status]]) }>{ note }</span>
      <span className={ css.rightButtons }></span>
    </li>
  )
}

export default ArchivedTask
