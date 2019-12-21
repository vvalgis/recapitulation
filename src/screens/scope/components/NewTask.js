import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import * as actions from 'actions'
import { TaskForm } from './'
import { Button, Icon } from 'elements'

const NewTask = ({ scope }) => {
  const dispatch = useDispatch()
  const [onEdit, setOnEdit] = useState(false)
  const showForm = (event) => setOnEdit(true)
  const submitNewTask = (note) => {
    setOnEdit(false)
    if (!isEmpty(note.trim())) {
      dispatch(actions.task.addToScope({ scope, note }))
    }
  }
  const handleCancel = (_event) => {
    setOnEdit(false)
  }

  return onEdit ? <TaskForm onSubmit={ submitNewTask } onCancel={ handleCancel } /> : <Button name="add" title="Add Task" onClick={ showForm }><Icon name="add" /></Button>
}

export default NewTask
