import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'
import { ChangeStatusButton, EditButton } from 'elements'
import { TaskForm } from 'components'

const Task = ({ task, statusNames }) => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()
  const submitNewNote = (note) => {
    setEditing(false)
    dispatch(actions.task.updateNote({ task, note }))
  }
  // TODO: Extract to function
  const buttons = useMemo(() => ({
    done: { button: ChangeStatusButton, name: 'Done', newStatus: 'done' },
    remove: { button: ChangeStatusButton, name: 'Remove', newStatus: 'removed' },
    restore: { button: ChangeStatusButton, name: 'Restore', newStatus: 'active' },
    edit: { button: EditButton, handleClick: () => setEditing(editing ? false : true) }
  }), [editing])
  // TODO: Extract to function
  const statuses = useMemo(() => [
    { leftAside: [buttons.done], rightAside: [buttons.edit, buttons.remove] },
    { leftAside: [buttons.restore], rightAside: [] },
    { leftAside: [], rightAside: [] },
    { leftAside: [buttons.restore], rightAside: [] }
  ], [])
  const taskStatus = statuses[task.status]
  // TODO: Extract to function
  const showButtons = (buttons) => buttons.map(({ button: Abutton, ...args }, key) => <Abutton { ...{ key, task, ...args } } />)

  // TODO: Extract to function
  const renderTask = () => {
    return (
      <li>
        <span className="left-buttons">{ showButtons(taskStatus.leftAside) }</span>
        <span className={ `task ${ statusNames[task.status] }` }>{ task.note }</span>
        <span className="right-buttons">{ showButtons(taskStatus.rightAside) }</span>
      </li>
    )
  }

  // TODO: Extract to function
  const renderForm = () => {
    return <li><TaskForm { ...{ task, onSubmit: submitNewNote } } /></li>
  }

  return editing ? renderForm() : renderTask()
}

export default Task
