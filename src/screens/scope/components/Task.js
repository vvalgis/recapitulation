import css from './../style.sss'
import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import CN from 'classnames'
import * as actions from 'actions'
import { ChangeStatusButton, EditButton } from 'elements'
import { TaskForm } from './'

const prepareStatuses = (buttons) => () => {
  return [
    { leftAside: [buttons.done], rightAside: [buttons.edit, buttons.remove] },
    { leftAside: [buttons.restore], rightAside: [] },
    { leftAside: [], rightAside: [] },
    { leftAside: [buttons.restore], rightAside: [] }
  ]
}

const prepareButtons = (editing, setEditing) => () => ({
  done: { button: ChangeStatusButton, name: 'done', newStatus: 'done' },
  remove: { button: ChangeStatusButton, name: 'remove', newStatus: 'removed' },
  restore: { button: ChangeStatusButton, name: 'restore', newStatus: 'active' },
  edit: { button: EditButton, handleClick: () => setEditing(editing ? false : true) }
})

const renderButton = ({ button: Abutton, ...args }, task, key) => <Abutton { ...{ key, task, ...args } } />

const renderButtons = (buttons, task) => buttons.map((button, key) => renderButton(button, task, key))

const renderTask = (task, { leftAside, rightAside }, className) => {
  return (
    <li>
      <span className={ css.leftButtons }>{ renderButtons(leftAside, task) }</span>
      <span className={ CN(css.task, css[className]) }>{ task.note }</span>
      <span className={ css.rightButtons }>{ renderButtons(rightAside, task) }</span>
    </li>
  )
}

const renderForm = (task, submitNewNote, cancelEditing) =>  {
  return <li><TaskForm { ...{ task, onSubmit: submitNewNote, onCancel: cancelEditing } } /></li>
}

const Task = ({ task, statusNames }) => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()
  const submitNewNote = (note) => {
    setEditing(false)
    dispatch(actions.task.updateNote({ task, note }))
  }
  const cancelEditing = () => {
    setEditing(false)
  }
  const buttons = useMemo(prepareButtons(editing, setEditing), [editing])
  const statuses = useMemo(prepareStatuses(buttons), [])
  const taskStatus = statuses[task.status]

  return editing ? renderForm(task, submitNewNote, cancelEditing) : renderTask(task, taskStatus, statusNames[task.status])
}

export default Task
