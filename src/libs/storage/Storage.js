import fs from 'fs'
import initSqlJs from 'sql.js'
import { entries, isEmpty, zipObject, includes, keys } from 'lodash'
import { emptyFn } from 'libs/utils'
import DataSchema from './DataSchema'

const escapeValue = (type, value) => (type === 'TEXT' || type === 'BLOB') ? `"${ value }"` : value

const escapeValues = (types, entity, handlerFn = (...args) => args) => {
  return entries(entity).map(([ fieldName, value ]) => {
    return handlerFn(fieldName, escapeValue(types[fieldName], value))
  })
}

const rowDefToStr = ({ name, type, required, defaultValue }) => {
  return [
    [name, true],
    [type, true],
    ['not null', required],
    [`default ${defaultValue}`, defaultValue !== false],
  ].map(([subStr, guard]) => guard ? subStr : '').join(' ')
}

const schemasIsEmpty = (exec) => isEmpty(exec("SELECT name FROM sqlite_master WHERE type='table'"))

const queryRows = (exec, query) => {
  let result = []
  if (!schemasIsEmpty(exec)) { // TODO: not trigger this everytime
    const executionResult = exec(query)

    if (!isEmpty(executionResult)) {
      const { columns = [], values = [] } = executionResult[0]
      result = values.map((record) => zipObject(columns, record))
    }
  }

  return result
}

const queryRecord = (exec, query) => {
  const rows = queryRows(exec, query)

  return rows[0] || {}
}

const recentOne = (exec, { tableName }) => ({ by }) => {
  return queryRecord(exec, `select * from ${ tableName } order by ${ by } desc limit 1`)
}

const find = (exec, { tableName, entity }) => (uuid) => {
  const query = `select * from ${ tableName } where uuid = "${uuid}"`
  const entityData = queryRecord(exec, query)

  if (isEmpty(entityData)) {
    console.error(`Not found uuid "${ uuid }" in "${ tableName }"`)
    return entityData
  } else {
    return entity(entityData)
  }
}

const findBy = (exec, schema) => (fieldName, fieldValue, { sign = '=', all = false, order = null, dir = 'asc' }) => {
  const wrongFieldName = !includes(schema.fields, fieldName)
  if (wrongFieldName) {
    return Promise.reject(`No field "${ fieldName }" present in "${ schema.tableName }"`)
  }
  const escapedValue = escapeValue(schema.types[fieldName], fieldValue)
  let query = `select * from ${ schema.tableName } where ${fieldName} ${sign} ${escapedValue}`
  query = order ? `${query} order by ${order} ${dir}` : query
  query = all ? query : `${query} limit 1`
  const wrapResult = (record) => schema.entity(record)
  const queryFn = all ? queryRows : queryRecord
  const result = queryFn.call(null, exec, query)

  if (isEmpty(result)) {
    // console.error(`Not found ${ fieldName } ${sign} "${ fieldValue }" in "${ schema.tableName }"`)
    return all ? [] : {}
  } else {
    return all ? result.map(wrapResult) : wrapResult(result)
  }
}

const insert = (exec, { types, tableName }) => (entity) => {
  const columns = keys(entity)
  const values = escapeValues(types, entity, (fieldName, escapedValue) => escapedValue)
  const query = `insert into ${ tableName } (${ columns.join(',') }) values (${ values.join(',') })`
  const executionResult = exec(query)

  return entity
}

const update = (exec, { types, tableName }) => (entity) => {
  const values = escapeValues(types, entity, (fieldName, escapedValue) => `${ fieldName } = ${ escapedValue }`)
  const query = `update ${ tableName } set ${ values.join(',') } where uuid = "${ entity.uuid }"`
  const executionResult = exec(query)

  return entity
}

const destroy = (exec, { tableName }) => (entity) => {
  const query = `delete from ${ tableName } where uuid = "${ entity.uuid }"`
  const executionResult = exec(query)

  return entity
}

const withSchema = (exec, schema) => {
  return {
    recentOne:  recentOne(exec, schema),
    find:  find(exec, schema),
    findBy:  findBy(exec, schema),
    insert:  insert(exec, schema),
    update:  update(exec, schema),
    delete:  destroy(exec, schema)
  }
}

const initSchemas = (exec) => (schemas) => {
  const queries = schemas.map(({ tableName, columns }) => {
    const fields = columns.map(rowDefToStr).join(', ')
    return `create table ${tableName} (${fields})`
  })
  exec(queries.join(';'))
}

const Storage = (provider) => {
  const exec = provider ? provider.exec.bind(provider) : emptyFn

  return {
    init: async (databaseContent) => {
      const sql = await initSqlJs()

      return new sql.Database(databaseContent)
    },
    initSchemas: provider && schemasIsEmpty(exec) ? initSchemas(exec) : emptyFn,
    schema: (dataSchema) => withSchema(exec, DataSchema(dataSchema)),
  }
}

export default Storage
