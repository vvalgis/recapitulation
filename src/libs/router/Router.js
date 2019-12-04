import React, { useState } from 'react'
import Routing from './routingContext'

const Router = ({ children }) => {
  const [ hash, setHash ] = useState(window.location.hash.substring(1))
  const routeState = [
    hash,
    (newHash) => {
      window.location.hash = newHash
      setHash(newHash)
    }
  ]
  return <Routing.Provider value={ routeState }>{ children }</Routing.Provider>
}

export default Router
