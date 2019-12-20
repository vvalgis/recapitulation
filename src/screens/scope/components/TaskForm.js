import React, { Fragment, useState } from 'react'
import { Button, Icon } from 'elements'

const TaskForm = ({ task = { note: '' }, onSubmit }) => {
  const [note, setNote] = useState(task.note)
  const noteHandler = (event) => {
    setNote(event.target.value)
  }
  const handleEnter = ({ key }) => {
    if (key === 'Enter') {
      handleSubmit()
    }
  }
  const handleSubmit = (event) => {
    setNote('')
    onSubmit(note)
  }

  return (
    <Fragment>
      <input value={ note } onChange={ noteHandler } onKeyDown={ handleEnter } />
      <Button name="add" onClick={ handleSubmit }><Icon name="add" /></Button>
    </Fragment>
  )
}

export default TaskForm
