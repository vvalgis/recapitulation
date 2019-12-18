import css from './buttons'
import React from 'react'
import CN from 'classnames'

const Button = ({ name, onClick: onClickHandler, title = '', children }) => {
  return <button title={ title } className={ CN(css.button, css[`button-${name}`]) } onClick={ onClickHandler }>{ children }</button>
}

export default Button
