import { Task } from 'libs/storage/schemas'
import Storage from 'libs/storage/Storage'
import DataSchema from 'libs/storage/DataSchema'

const getByScopeId = (db, uuid) => {
  return Storage(db).schema(Task).findBy('scope_id', uuid, { all: true })
}

const addToScope = (db, scope, note) => {
  const entity = DataSchema(Task).entity({ scope_id: scope.uuid, note })

  return Storage(db).schema(Task).insert(entity)
}

const updateNote = (db, task, note) => {
  const entity = DataSchema(Task).entity({ ...task, note })

  return Storage(db).schema(Task).update(entity)
}

const changeStatus = (db, task, statusName) => {
  const newStatus = Task.enums.statuses.indexOf(statusName)

  if (newStatus !== -1) {
    const entity = DataSchema(Task).entity({ ...task, status: newStatus })

    return Storage(db).schema(Task).update(entity)
  } else {
    console.error(`No such status "${statusName}" in "Task.enums.statuses"`)

    return task
  }
}

const moveTo = (db) => (newScope) => (task) => {
  addToScope(db, newScope, task.note)

  return changeStatus(db, task, 'moved')
}

const only = (statusName) => (task) => task.status === Task.enums.statuses.indexOf(statusName)

export {
  getByScopeId,
  addToScope,
  updateNote,
  changeStatus,
  moveTo,
  only
}
