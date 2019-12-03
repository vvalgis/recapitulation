import { Storage, DataSchema, Data } from 'main'

const getByScopeId = (db, uuid) => {
  return Storage.provider(db).schema(DataSchema.Task).findBy('scope_id', uuid, { all: true })
}

const addToScope = (db, scope, note) => {
  const entity = Data.entity(DataSchema.Task, { scope_id: scope.uuid, note })
  return Storage.provider(db).schema(DataSchema.Task).insert(entity)
}

const updateNote = (db, task, note) => {
  const entity = Data.entity(DataSchema.Task, { ...task, note })
  return Storage.provider(db).schema(DataSchema.Task).update(entity)
}

const changeStatus = (db, task, statusName) => {
  const newStatus = DataSchema.Task.enums.statuses.indexOf(statusName)
  if (newStatus !== -1) {
    const entity = Data.entity(DataSchema.Task, { ...task, status: newStatus })
    return Storage.provider(db).schema(DataSchema.Task).update(entity);
  } else {
    console.error(`No such status "${statusName}" in "DataSchema.Task.enums.statuses"`)
    return task
  };
}

const moveTo = (db) => (newScope) => (task) => {
  addToScope(db, newScope, task.note)
  return changeStatus(db, task, 'moved')
}

const only = (statusName) => (task) => task.status === DataSchema.Task.enums.statuses.indexOf(statusName)

export {
  getByScopeId,
  addToScope,
  updateNote,
  changeStatus,
  moveTo,
  only
}
