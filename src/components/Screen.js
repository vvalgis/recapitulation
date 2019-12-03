import React from 'react'

const Screen = ({ className, children }) => {
  return <section className={ `screen ${className}` }>{ children }</section>
}

export default Screen
