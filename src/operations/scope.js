import { Storage, DataSchema, Data } from 'main'
import { getByScopeId, moveTo, only } from 'operations/task'

const isCurrent = (db, scope) => {
  return !_.isEmpty(scope.uuid) && getLast(db).uuid === scope.uuid
}

const create = (db, params = {}) => {
  return Storage.provider(db).schema(DataSchema.Scope).insert(Data.entity(DataSchema.Scope, params))
}

const getLast = (db) => {
  return Storage.provider(db).schema(DataSchema.Scope).recentOne({ by: 'created_at' })
}

const recapitulate = (db, scope) => {
  const tasks = getByScopeId(db, scope.uuid)
  const newScope = create(db)
  const newTasks = tasks.filter(only('active')).map(moveTo(db)(newScope))
  const recapitulatedScope = Data.entity(DataSchema.Scope, { ...scope, recapitulated_at: Date.now() })

  Storage.provider(db).schema(DataSchema.Scope).update(recapitulatedScope)
  return newScope
}

const findNeighborsFor = (db, scope) => {
  const scopeForCondition = (options) => {
    return Storage.provider(db).schema(DataSchema.Scope).findBy('created_at', scope.created_at, { order: 'created_at', ...options })
  }

  return {
    forwardScope: scopeForCondition({ sign: '>', dir: 'asc' }),
    backwardScope: scopeForCondition({ sign: '<', dir: 'desc' })
  }
}

export {
  isCurrent,
  create,
  getLast,
  recapitulate,
  findNeighborsFor
}
