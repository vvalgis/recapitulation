import css from './style.sss'
import React from 'react'

const LoadingAppLayout = ({ children }) => {
  return (
    <section className={ css.screen }>
      { children }
    </section>
  )
}

export default LoadingAppLayout
