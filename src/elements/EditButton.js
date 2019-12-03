import React from 'react'
import { Button, Icon } from 'elements'

const EditButton = ({ handleClick }) => {
  return (
    <Button name="edit" onClick={ handleClick }><Icon name="edit" /></Button>
  )
}

export default EditButton
