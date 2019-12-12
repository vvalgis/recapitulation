import { fromPairs, isUndefined, pick } from 'lodash'

const fields = ({ columns }) => columns.map(({ name }) => name)

const types = ({ columns }) => fromPairs(columns.map(({ name, type }) => [name, type]))

const initFields = (schema) => (result, fieldName) => {
  const defaultValue = schema.defaultValues[fieldName]
  return {
    ...result,
    ...(isUndefined(defaultValue) ? {} : { [fieldName]: defaultValue() })
  }
}

const hollowEntity = (schema) => fields(schema).reduce(initFields(schema), {})

const entity = (schema, props) => Object.assign({}, hollowEntity(schema), pick(props, fields(schema)))

const DataSchema = (schema) => {
  return {
    fields: fields(schema),
    types: types(schema),
    entity: (props) => entity(schema, props),
    tableName: schema.tableName
  }
}

export default DataSchema
