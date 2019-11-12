import { compose, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, reducers } from 'reducers'

const composeEnhancers = composeWithDevTools({trace: true, traceLimit: 25}) || compose;

export const store = createStore(
  rootReducer(reducers),
  composeEnhancers(
    applyMiddleware(thunk),
  )
);
