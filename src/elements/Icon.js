import React from 'react'

const Icon = ({ name, alt = '' }) => {
  return <i className={ `icon icon-${name}` } alt={ alt }></i>
}

export default Icon
