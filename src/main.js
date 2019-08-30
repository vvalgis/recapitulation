const dropbox = {
  accessToken: 'eKPyzL4RyRgAAAAAAACjnEYGG9IchsVABgMybC-GocXkITnngpB4DX9X8wzzsV3Y',
  dbFileName: '/recapitulation.sqlite'
};

const Dropbox = new window.Dropbox.Dropbox({ accessToken: dropbox.accessToken, fetch });

const StorageInit = (schemaUtils, lodash) => {
  const escapeValue = (type, value) => {
    return (type === 'TEXT' || type === 'BLOB') ? `"${ value }"` : value;
  };
  const escapeValues = (types, entity, handlerFn = (...args) => args) => {
    return lodash.entries(entity).map(([ fieldName, value ]) => {
      return handlerFn(fieldName, escapeValue(types[fieldName], value));
    });
  };
  const rowDefToStr = ({ name, type, required, defaultValue }) => {
    const mandatory = () => true;
    return [
      [name, mandatory],
      [type, mandatory],
      ['not null', () => required],
      [`default ${defaultValue}`, () => defaultValue !== false],
    ].map(([subStr, validator]) => validator() ? subStr : '').join(' ');
  };
  const isEmpty = (provider) => lodash.isEmpty(provider.exec("SELECT name FROM sqlite_master WHERE type='table'"));
  const queryRows = (provider, query) => {
    let result = [];
    if (!isEmpty(provider)) {
      const executionResult = provider.exec(query);
      if (!lodash.isEmpty(executionResult)) {
        const { columns = [], values = [] } = executionResult[0];
        result = values.map((record) => lodash.zipObject(columns, record));
      }
    };
    return result;
  };
  const queryRecord = (provider, query) => {
    const rows = queryRows(provider, query);
    return rows[0] || {};
  };
  const withSchema = (provider, dataSchema) => {
    return {
      recentOne: ({ by }) => {
        return queryRecord(provider, `select * from ${ dataSchema.tableName } order by ${ by } desc limit 1`);
      },
      find: (uuid) => {
        const query = `select * from ${ dataSchema.tableName } where uuid = "${uuid}"`;
        const entity = queryRecord(provider, query);
        if (lodash.isEmpty(entity)) {
          console.error(`Not found uuid "${ uuid }" in "${ dataSchema.tableName }"`);
          return entity;
        } else {
          return schemaUtils.entity(dataSchema, entity);
        };
      },
      findBy: (fieldName, fieldValue, { sign = '=', all = false, order = null, dir = 'asc' }) => {
        const wrongFieldName = !lodash.includes(schemaUtils.fields(dataSchema), fieldName);
        if (wrongFieldName) {
          return Promise.reject(`No field "${ fieldName }" present in "${ dataSchema.tableName }"`);
        };
        const escapedValue = escapeValue(schemaUtils.types(dataSchema)[fieldName], fieldValue);
        let query = `select * from ${ dataSchema.tableName } where ${fieldName} ${sign} ${escapedValue}`;
        query = order ? `${query} order by ${order} ${dir}` : query;
        query = all ? query : `${query} limit 1`;
        const wrapResult = (record) => schemaUtils.entity(dataSchema, record);
        const queryFn = all ? queryRows : queryRecord;
        const result = queryFn.call(null, provider, query);
        if (lodash.isEmpty(result)) {
          console.error(`Not found ${ fieldName } ${sign} "${ fieldValue }" in "${ dataSchema.tableName }"`);
          return all ? [] : {};
        } else {
          return all ? result.map(wrapResult) : wrapResult(result);
        };
      },
      insert: (entity) => {
        const types = schemaUtils.types(dataSchema);
        const columns = lodash.keys(entity);
        const values = escapeValues(types, entity, (fieldName, escapedValue) => escapedValue);
        const query = `insert into ${ dataSchema.tableName } (${ columns.join(',') }) values (${ values.join(',') })`;
        const executionResult = provider.exec(query);
        return entity;
      },
      update: (entity) => {
        const types = schemaUtils.types(dataSchema);
        const values = escapeValues(types, entity, (fieldName, escapedValue) => `${ fieldName } = ${ escapedValue }`);
        const query = `update ${ dataSchema.tableName } set ${ values.join(',') } where uuid = "${ entity.uuid }"`;
        const executionResult = provider.exec(query);
        return entity;
      },
      delete: (entity) => {
        const query = `delete from ${ dataSchema.tableName } where uuid = "${ entity.uuid }"`;
        const executionResult = provider.exec(query);
        return entity;
      },
    };
  };

  const withProvider = (provider) => {
    return {
      schema: (dataSchema) => withSchema(provider, dataSchema),
      initSchemas: (schemas) => {
        const queries = schemas.map(({ tableName, columns }) => {
          const fields = columns.map(rowDefToStr).join(', ');
          return `create table ${tableName} (${fields})`;
        });
        provider.exec(queries.join(';'));
        return provider;
      },
      isEmpty: () => isEmpty(provider),
    };
  };
  return {
    init: null,
    provider: (provider) => withProvider(provider),
  };
};

const uuid = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]\&15 >> c/4).toString(16));

const Data = {
  fields: ({ columns }) => columns.map(({ name }) => name),
  types: ({ columns }) => _.fromPairs(columns.map(({ name, type }) => [name, type])),
  hollowEntity: (schema) => Data.fields(schema).reduce((result, fieldName) => {
    const defaultValue = schema.defaultValues[fieldName];
    return {
      ...result,
      ...(_.isUndefined(defaultValue) ? {} : { [fieldName]: defaultValue() })
    };
  }, {}),
  entity: (schema, props) => {
    return Object.assign({}, Data.hollowEntity(schema), _.pick(props, Data.fields(schema)));
  },
};

const DataSchema = {
  Scope: {
    tableName: 'scopes',
    columns: [
      { name: 'uuid', type: 'TEXT', required: true, defaultValue: false },
      { name: 'created_at', type: 'INT', required: true, defaultValue: false },
      { name: 'recapitulated_at', type: 'INT', required: false, defaultValue: false },
    ],
    defaultValues: {
      uuid: () => uuid(),
      created_at: () => Date.now()
    }
  },
  Task: {
    tableName: 'tasks',
    columns: [
      { name: 'uuid', type: 'TEXT', required: true, defaultValue: false },
      { name: 'scope_id', type: 'TEXT', required: true, defaultValue: false },
      { name: 'note', type: 'TEXT', required: true, defaultValue: false },
      { name: 'status', type: 'INT', required: true, defaultValue: 0 },
    ],
    defaultValues: {
      uuid: () => uuid(),
      status: () => 0
    },
    enums: {
      statuses: ['active', 'done', 'moved', 'removed']
    }
  },
};

const emptyFn = () => {};
const dummyFn = (...args) => args;
const isScopesEqual = (nextScope, prevScope) => {
  const bothEmpty = _.isEmpty(nextScope) \&\& _.isEmpty(prevScope);
  const bothHasUUID = _.has(nextScope, 'uuid') \&\& _.has(prevScope, 'uuid');
  return (bothHasUUID \&\& nextScope.uuid == prevScope.uuid) || bothEmpty;
};
const { Provider, useDispatch, useSelector } = ReactRedux;
const { useState, useEffect, useMemo } = React;

const useDispatchAction = (actionFn, { args = [], deps = null } = {}) => {
  const dispatch = useDispatch();
  return useEffect(() => {
    dispatch(actionFn(...args));
    return emptyFn;
  }, deps);
};

const formatScopeDate = (date) => {
  const dateObj = new Date(date);
  const isCurrentYear = dateObj.getFullYear() === (new Date()).getFullYear();
  const year = isCurrentYear ? '' : `.${ dateObj.getFullYear() }`;
  const pad = (num) => (num < 10 ? ('0' + num) : num);
  const dateStr = `${pad(dateObj.getDate())}.${pad(dateObj.getMonth() + 1)}${ year }`;
  const timeStr = ['getHours', 'getMinutes', 'getSeconds'].map((fnName) => pad(dateObj[fnName]())).join(':');
  return [dateStr, timeStr].join(' ');
};


const Storage = StorageInit(Data, _);
initSqlJs().then((sql) => {
  Storage.init = (databaseContent) => new sql.Database(databaseContent);
});
