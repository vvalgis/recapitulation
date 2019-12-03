import React, { Fragment, useState } from 'react'
import { Button, Icon } from 'elements'

const SettingForm = ({ setting = { name: '', title: '', value: '' }, onSave }) => {
  const [value, setValue] = useState(setting.value)
  const valueHandler = (event) => {
    setValue(event.target.value)
  }
  const handleEnter = ({ key }) => {
    if (key === 'Enter') {
      handleSubmit()
    }
  }
  const handleSubmit = (event) => {
    onSave({ ...setting, value })
  }
  return (
    <Fragment>
      <dt>{ setting.title }</dt>
      <dd>
        <input value={ value } onChange={ valueHandler } onKeyDown={ handleEnter } />
        <Button name="done" onClick={ handleSubmit }><Icon name="done" /></Button>
      </dd>
    </Fragment>
  )
}

export default SettingForm
