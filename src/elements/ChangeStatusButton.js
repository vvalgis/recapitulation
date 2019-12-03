import React from 'react'
import { useDispatch } from 'react-redux'
import * as actions from 'actions'
import { Button, Icon } from 'elements'

const ChangeStatusButton = ({task, name, newStatus}) => {
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(actions.task.changeStatus(task, newStatus))
  }

  return (
    <Button name={ name } onClick={ handleClick }><Icon name={ name } /></Button>
  )
}

export default ChangeStatusButton
