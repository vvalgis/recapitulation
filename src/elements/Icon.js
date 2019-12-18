import css from './icons'
import React from 'react'
import CN from 'classnames'

const Icon = ({ name, alt = '' }) => {
  return <i className={ CN(css.icon, css[`icon-${name}`]) } alt={ alt }></i>
}

export default Icon
