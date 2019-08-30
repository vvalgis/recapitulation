const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true, traceLimit: 25}) || Redux.compose;
const store = Redux.createStore(
  rootReducer(reducers),
  composeEnhancers(
    Redux.applyMiddleware(ReduxThunk.default),
  )
);
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Recapitulation />
    </Router>
  </Provider>,
  document.querySelector('#root')
);
