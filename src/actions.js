import operations from 'operations'
import { Dropbox } from 'main'
import { get as getConfigParam } from 'config'

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
          dispatch(events.dbFileRecieved(response));
          operations.db.init(dbFileContent).then((db) => {
            // localStorage.setItem('dbFileContent', dbFileContent); /* put db to cache */
            dispatch(events.dbFileSynced(db))
          })
        })
      }
      const onError = (response) => {
        dispatch(events.errorReceived(response));
        operations.db.init([]).then((db) => {
          // dispatch(actions.db.syncFile(db))
        })
      };
      // const content = localStorage.getItem('dbFileContent'); /* get db from cache */
      const content = null
      if (!_.isEmpty(content)) { /* init db from cache */
        operations.db.init(content).then((db) => {
          dispatch(events.dbFileSynced(db))
        })
      } else {
        return Dropbox.filesDownload({path: getConfigParam('recapitulationDropboxDbFileName')}).then(onSuccess, onError);
      }
    },
    syncFile: (db) => (dispatch) => {
      const dbFileContent = db.export().buffer;
      const onSuccess = (response) => {
        dispatch(events.dbFileRecieved(response));
        dispatch(events.dbFileSynced(db));
        // localStorage.removeItem('dbFileContent'); /* db cache */
      };
      const onError = (response, dispatch) => {
        dispatch(events.errorReceived(response));
      };
      const args = { contents: dbFileContent, path: getConfigParam('recapitulationDropboxDbFileName'), mode: 'overwrite' };
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

export {
  events,
  actions
}
