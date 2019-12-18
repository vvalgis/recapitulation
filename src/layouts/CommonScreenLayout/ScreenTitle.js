import css from './style.sss'
import React from 'react'

const ScreenTitle = ({ children }) => {
  return (
    <header className={ css.title }>
      <h1>{ children }</h1>
    </header>
  )
}

export default ScreenTitle
