export default [
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
