import React from 'react'
import { useRouter } from 'libs/router'

const Switch = ({ to, children }) => {
  const { navigate } = useRouter()
  return <a className="route-link" onClick={ () => navigate(to) }>{ children }</a>
}

export default Switch
