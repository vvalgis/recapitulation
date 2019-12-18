import css from './../style.sss'
import React, { Fragment } from 'react'
import { save as saveSetting } from 'libs/config'
import SettingForm from './SettingForm'

const renderWelcomeText = () => {
  return (
    <p className="welcome-text">Please provide settings</p>
  )
}

const Settings = ({ settings, initialized }) => {
  return (
    <Fragment>
      { !initialized && renderWelcomeText() }
      <dl className={ css.settings }>
        { settings.map((setting) => <SettingForm { ...{ setting, onSave: saveSetting, key: setting.name } } />) }
      </dl>
    </Fragment>
  )
}

export default Settings
