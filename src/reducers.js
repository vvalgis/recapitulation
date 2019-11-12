const initialState = {
  db: null,
  dbFileMetaData: {},
  currentScope: {},
  currentTasks: [],
  backwardScope: {},
  forwardScope: {},
  isActiveScope: false
};

const mappingEventToStoreCompartment = {
  errorReceived: 'currentError',
  dbFileRecieved: 'dbFileMetaData',
  dbFileSynced: 'db',
  scopeRecieved: 'currentScope',
  tasksRecieved: 'currentTasks',
  taskAdded: 'currentTasks',
  taskUpdated: 'currentTasks',
  'backwardScopeRecieved': 'backwardScope',
  'forwardScopeRecieved': 'forwardScope',
  'activeScopeSet': 'isActiveScope'
};

const putPayloadIntoCompartment = (_state, { payload }) => payload;
const addPayloadIntoCompartment = (state, { payload }) => ([ ...state, payload ]);
const replacePayloadInCompartment = (currentTasks, { payload }) => {
  return currentTasks.map((task) => task.uuid === payload.uuid ? payload : task);
};

const reducers = Object.keys(mappingEventToStoreCompartment).reduce((result, eventName) => {
  return { ...result, [eventName]: putPayloadIntoCompartment };
}, {});

reducers.taskAdded = addPayloadIntoCompartment;
reducers.taskUpdated = replacePayloadInCompartment;

const getFromCompartment = (compartmentName) => (state) => state[compartmentName];

const rootReducer = (reducers) => (state = initialState, action) => {
  const compartment = mappingEventToStoreCompartment[action.type];
  if (compartment) {
    return { ...state, [compartment]: reducers[action.type](state[compartment], action) };
  } else {
    return state;
  }
};

export {
  reducers,
  getFromCompartment,
  rootReducer
}
