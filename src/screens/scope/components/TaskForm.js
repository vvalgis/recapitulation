import React, { Fragment, useState } from 'react'
import { Button, Icon } from 'elements'

const TaskForm = ({ task = { note: '' }, onSubmit, onCancel }) => {
  const [note, setNote] = useState(task.note)
  const noteHandler = (event) => {
    setNote(event.target.value)
  }
  const handleKeyDown = ({ key }) => {
    if (key === 'Enter') {
      handleSubmit()
    }
    if (key === 'Escape') {
      handleCancel()
    }
  }
  const handleSubmit = (_event) => {
    setNote('')
    onSubmit(note)
  }
  const handleCancel = (_event) => {
    onCancel()
  }

  return (
    <Fragment>
      <Button name="cancel" onClick={ handleCancel }><Icon name="restore" /></Button>
      <input autoFocus value={ note } onChange={ noteHandler } onKeyDown={ handleKeyDown } />
      <Button name="save" onClick={ handleSubmit }><Icon name="save" /></Button>
    </Fragment>
  )
}

export default TaskForm
