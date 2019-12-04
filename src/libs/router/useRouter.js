import React, { useContext, useMemo } from 'react'
import Routing from './routingContext'
import routes from './routes'

const useRouter = () => {
  const [ hash, setHash ] = useContext(Routing)
  const { component } = useMemo(() => routes.find(({ path }) => path === hash), [hash])

  return {
    currentComponent: component,
    navigate: setHash
  }
}

export default useRouter
