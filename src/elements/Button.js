import React from 'react'

const Button = ({ name, onClick: onClickHandler, title = '', children }) => {
  return <button title={ title } className={ `button button-${name}` } onClick={ onClickHandler }>{ children }</button>
}

export default Button
