import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import { store } from 'store'
import { Router } from 'routes'
import css from 'style.css'

import { Recapitulation } from 'screens'

render(
  <Provider store={store}>
    <Router>
      <Recapitulation />
    </Router>
  </Provider>,
  document.querySelector('#root')
);