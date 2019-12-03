import React from 'react'

const ArchivedTask = ({ task: { status, note }, statusNames }) => {
  return (
    <li>
      <span className="left-buttons"></span>
      <span className={ `task ${ statusNames[status] }` }>{ note }</span>
      <span className="right-buttons"></span>
    </li>
  )
}

export default ArchivedTask
