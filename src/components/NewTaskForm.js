import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'
import { TaskForm } from 'components'
import { Button, Icon } from 'elements'

const NewTaskForm = ({ scope, onSubmit }) => {
  const dispatch = useDispatch()
  const [onEdit, setOnEdit] = useState(false)
  const showForm = (event) => setOnEdit(true)
  const submitNewTask = (note) => {
    setOnEdit(false)
    dispatch(actions.task.addToScope({ scope, note }))
  }

  return onEdit ? <TaskForm onSubmit={ submitNewTask } /> : <Button name="add" title="Add Task" onClick={ showForm }><Icon name="add" /></Button>
}

export default NewTaskForm
