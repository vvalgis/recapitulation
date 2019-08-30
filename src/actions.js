const events = [
  'errorReceived',
  'dbFileRecieved',
  'dbFileSynced',
  'scopeRecieved',
  'tasksRecieved',
  'taskAdded',
  'taskUpdated',
  'backwardScopeRecieved',
  'forwardScopeRecieved',
  'activeScopeSet',
].reduce((result, eventName) => ({ ...result, [eventName]: (payload) => ({ type: eventName, payload }) }), {});

const actions = {
  db: {
    loadFile: () => (dispatch) => {
      const onSuccess = (response) => {
        new Response(response.fileBlob).arrayBuffer().then((dbFileContent) => {
          localStorage.setItem('dbFileContent', dbFileContent); /* db cache */
          const db = operations.db.init(dbFileContent);
          dispatch(events.dbFileRecieved(response));
          dispatch(events.dbFileSynced(db));
        });
      };
      const onError = (response) => {
        dispatch(events.errorReceived(response));
        dispatch(actions.db.syncFile(operations.db.init([])));
      };
      const content = localStorage.getItem('dbFileContent'); /* db cache */
      if (_.isEmpty(content)) {
        dispatch(events.dbFileSynced(operations.db.init(content))); /* db cache */
      } else {
        return Dropbox.filesDownload({path: dropbox.dbFileName}).then(onSuccess, onError);
      }
    },
    syncFile: (db) => (dispatch) => {
      const dbFileContent = db.export().buffer;
      const onSuccess = (response) => {
        dispatch(events.dbFileRecieved(response));
        dispatch(events.dbFileSynced(db));
        localStorage.removeItem('dbFileContent'); /* db cache */
      };
      const onError = (response, dispatch) => {
        dispatch(events.errorReceived(response));
      };
      const args = { contents: dbFileContent, path: dropbox.dbFileName, mode: 'overwrite' };
      return Dropbox.filesUpload(args).then(onSuccess, onError);
    },
  },
  scope: {
    init: () => (dispatch, getState) => {
      dispatch(actions.scope.switchTo(operations.scope.create(getState().db)));
    },
    setActive: (currentScope) => (dispatch, getState) => {
      const isActiveScope = operations.scope.isCurrent(getState().db, currentScope);
      dispatch(events.activeScopeSet(isActiveScope));
    },
    getLast: () => (dispatch, getState) => {
      const currentScope = operations.scope.getLast(getState().db);
      if (_.isEmpty(currentScope)) {
        dispatch(actions.scope.init());
      } else {
        dispatch(actions.scope.switchTo(currentScope));
      };
    },
    switchTo: (scope) => (dispatch, getState) => {
      if (!_.isEmpty(scope)) {
        dispatch(events.scopeRecieved(scope));
        dispatch(actions.scope.getAround(scope));
        dispatch(actions.scope.setActive(scope));
      };
    },
    getAround: (scope) => (dispatch, getState) => {
      const { forwardScope, backwardScope } = operations.scope.findNeighborsFor(getState().db, scope);
      dispatch(events.forwardScopeRecieved(forwardScope));
      dispatch(events.backwardScopeRecieved(backwardScope));
    },
    recapitulate: () => (dispatch, getState) => {
      const { db, currentScope } = getState();
      const newScope = operations.scope.recapitulate(db, currentScope);
      dispatch(actions.scope.switchTo(newScope));
    },
  },
  task: {
    getByScope: ({ uuid }) => (dispatch, getState) => {
      const tasks = operations.task.getByScopeId(getState().db, uuid);
      dispatch(events.tasksRecieved(tasks));
    },
    addToScope: ({ scope, note }) => (dispatch, getState) => {
      const newTask = operations.task.addToScope(getState().db, scope, note);
      dispatch(events.taskAdded(newTask));
    },
    updateNote: ({ task, note }) => (dispatch, getState) => {
      const updatedTask = operations.task.updateNote(getState().db, task, note);
      dispatch(events.taskUpdated(updatedTask));
    },
    changeStatus: (task, statusName) => (dispatch, getState) => {
      const updatedTask = operations.task.changeStatus(getState().db, task, statusName);
      dispatch(events.taskUpdated(updatedTask));
    },
  },
};
