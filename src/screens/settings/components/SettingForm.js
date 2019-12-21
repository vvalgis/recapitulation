import React, { Fragment, useState } from 'react'
import { Button, Icon } from 'elements'

const WithButtons = ({ editing, handleSubmit, handleCancel, children }) => {
  if (!editing) {
    return children
  } else {
    return (
      <Fragment>
        <Button name="cancel" onClick={ handleCancel }><Icon name="restore" /></Button>
        {children}
        <Button name="save" onClick={ handleSubmit }><Icon name="save" /></Button>
      </Fragment>
    )
  }
}

const SettingForm = ({ setting = { name: '', title: '', value: '' }, onSave }) => {
  const [value, setValue] = useState(setting.value)
  const [editing, setEditing] = useState(value != setting.value)
  const [prevValue, setPrevValue] = useState(setting.value)

  const valueHandler = (event) => {
    if (!editing) {
      setEditing(true)
      setPrevValue(value)
    }
    setValue(event.target.value)
  }
  const handleKeyDown = ({ key }) => {
    if (key === 'Enter') {
      handleSubmit()
    }
    if (key === 'Escape') {
      handleCancel()
    }
  }
  const handleSubmit = (_event) => {
    onSave({ ...setting, value })
    setValue(value)
    setEditing(false)
  }
  const handleCancel = (_event) => {
    onSave({ ...setting, value: prevValue })
    setValue(prevValue)
    setEditing(false)
  }
  return (
    <Fragment>
      <dt>{ setting.title }</dt>
      <dd>
        <WithButtons { ...{ editing, handleSubmit, handleCancel } }>
          <input autoFocus={ editing } value={ value } onChange={ valueHandler } onKeyDown={ handleKeyDown } />
        </WithButtons>
      </dd>
    </Fragment>
  )
}

export default SettingForm
