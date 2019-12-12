import { isEmpty } from 'lodash'
import { Scope } from 'libs/storage/schemas'
import Storage from 'libs/storage/Storage'
import DataSchema from 'libs/storage/DataSchema'
import { getByScopeId, moveTo, only } from 'operations/task'

const isCurrent = (db, scope) => {
  return !isEmpty(scope.uuid) && getLast(db).uuid === scope.uuid
}

const create = (db, params = {}) => {
  return Storage(db).schema(Scope).insert(DataSchema(Scope).entity(params))
}

const getLast = (db) => {
  return Storage(db).schema(Scope).recentOne({ by: 'created_at' })
}

const recapitulate = (db, scope) => {
  const tasks = getByScopeId(db, scope.uuid)
  const newScope = create(db)
  const newTasks = tasks.filter(only('active')).map(moveTo(db)(newScope))
  const recapitulatedScope = DataSchema(Scope).entity({ ...scope, recapitulated_at: Date.now() })

  Storage(db).schema(Scope).update(recapitulatedScope)
  return newScope
}

const findNeighborsFor = (db, scope) => {
  const scopeForCondition = (options) => {
    return Storage(db).schema(Scope).findBy('created_at', scope.created_at, { order: 'created_at', ...options })
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
