const operations = {
  db: {
    init: (content) => {
      const db = Storage.init(new Uint8Array(content));
      const storage = Storage.provider(db);
      return storage.isEmpty() ? storage.initSchemas(_.values(DataSchema)) : db;
    },
  },
  scope: {
    isCurrent: (db, scope) => {
      return !_.isEmpty(scope.uuid) \&\& operations.scope.getLast(db).uuid === scope.uuid;
    },
    create: (db, params = {}) => {
      return Storage.provider(db).schema(DataSchema.Scope).insert(Data.entity(DataSchema.Scope, params));
    },
    getLast: (db) => {
      return Storage.provider(db).schema(DataSchema.Scope).recentOne({ by: 'created_at' });
    },
    recapitulate: (db, scope) => {
      const tasks = operations.task.getByScopeId(db, scope.uuid);
      const newScope = operations.scope.create(db);
      const newTasks = tasks.filter(operations.task.only('active')).map(operations.task.moveTo(db)(newScope));
      const recapitulatedScope = Data.entity(DataSchema.Scope, { ...scope, recapitulated_at: Date.now() });
      Storage.provider(db).schema(DataSchema.Scope).update(recapitulatedScope);
      return newScope;
    },
    findNeighborsFor: (db, scope) => {
      const scopeForCondition = (options) => {
        return Storage.provider(db).schema(DataSchema.Scope).findBy('created_at', scope.created_at, { order: 'created_at', ...options });
      };
      return {
        forwardScope: scopeForCondition({ sign: '>', dir: 'asc' }),
        backwardScope: scopeForCondition({ sign: '<', dir: 'desc' })
      };
    },
  },
  task: {
    getByScopeId: (db, uuid) => {
      return Storage.provider(db).schema(DataSchema.Task).findBy('scope_id', uuid, { all: true });
    },
    addToScope: (db, scope, note) => {
      const entity = Data.entity(DataSchema.Task, { scope_id: scope.uuid, note });
      return Storage.provider(db).schema(DataSchema.Task).insert(entity);
    },
    updateNote: (db, task, note) => {
      const entity = Data.entity(DataSchema.Task, { ...task, note });
      return Storage.provider(db).schema(DataSchema.Task).update(entity);
    },
    changeStatus: (db, task, statusName) => {
      const newStatus = DataSchema.Task.enums.statuses.indexOf(statusName);
      if (newStatus !== -1) {
        const entity = Data.entity(DataSchema.Task, { ...task, status: newStatus });
        return Storage.provider(db).schema(DataSchema.Task).update(entity);
      } else {
        console.error(`No such status "${statusName}" in "DataSchema.Task.enums.statuses"`);
        return task;
      };
    },
    moveTo: (db) => (newScope) => (task) => {
      operations.task.addToScope(db, newScope, task.note);
      return operations.task.changeStatus(db, task, 'moved');
    },
    only: (statusName) => (task) => task.status === DataSchema.Task.enums.statuses.indexOf(statusName),
  },
};
