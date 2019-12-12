import { compose, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
  db: null,
  dbFileMetaData: {},
  currentScope: {},
  currentTasks: [],
  backwardScope: {},
  forwardScope: {},
  isActiveScope: false
}

const mapSignalToCompartment = {
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
}

const putPayloadIntoCompartment = (_state, { payload }) => payload
const addPayloadToCompartment = (state, { payload }) => ([ ...state, payload ])
const replacePayloadInCompartment = (currentTasks, { payload }) => {
  return currentTasks.map((task) => task.uuid === payload.uuid ? payload : task)
}

const reducers = Object.keys(mapSignalToCompartment).reduce((result, eventName) => {
  return { ...result, [eventName]: putPayloadIntoCompartment }
}, {})

reducers.taskAdded = addPayloadToCompartment
reducers.taskUpdated = replacePayloadInCompartment

const getFromCompartment = (compartmentName) => (state) => state[compartmentName]

const generalReducerFor = (compartment, reducers) => (state, action) => {
  return { ...state, [compartment]: reducers[action.type](state[compartment], action) }
}

const compartmentUpdaterFor = (actionType, reducers) => {
  const compartment = mapSignalToCompartment[actionType]

  return compartment ? generalReducerFor(compartment, reducers) : ((state, _action) => state)
}

const rootReducer = (reducers) => (state = initialState, action) => {
  return compartmentUpdaterFor(action.type, reducers)(state, action)
}

const composeEnhancers = composeWithDevTools({trace: true, traceLimit: 25}) || compose

const store = createStore(
  rootReducer(reducers),
  composeEnhancers(
    applyMiddleware(thunk),
  )
)

export {
  store,
  getFromCompartment
}
