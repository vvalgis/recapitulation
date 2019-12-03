import { task as opTask } from 'operations'
import signals from 'signals'

const getByScope = ({ uuid }) => (dispatch, getState) => {
  const tasks = opTask.getByScopeId(getState().db, uuid)

  dispatch(signals.tasksRecieved(tasks))
}

const addToScope = ({ scope, note }) => (dispatch, getState) => {
  const newTask = opTask.addToScope(getState().db, scope, note)

  dispatch(signals.taskAdded(newTask))
}

const updateNote = ({ task, note }) => (dispatch, getState) => {
  const updatedTask = opTask.updateNote(getState().db, task, note)

  dispatch(signals.taskUpdated(updatedTask))
}

const changeStatus = (task, statusName) => (dispatch, getState) => {
  const updatedTask = opTask.changeStatus(getState().db, task, statusName)

  dispatch(signals.taskUpdated(updatedTask))
}

export {
  getByScope,
  addToScope,
  updateNote,
  changeStatus
}
