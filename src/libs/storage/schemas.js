import { uuid } from 'libs/utils'

const Scope = {
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
}

const Task = {
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
}


export {
  Scope,
  Task
}
