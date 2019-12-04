import React, { Fragment } from 'react'
import { save as saveSetting } from 'libs/config'
import { ScreenTitle } from 'components'
import { BackButton } from 'elements'
import SettingForm from './SettingForm'

const Settings = ({ settings, initialized }) => {
  const renderNav = () => {
    return (
      <nav>
        <BackButton />
      </nav>
    )
  }

  const renderWelcomeText = () => {
    return (
      <p className="welcome-text">Please provide settings</p>
    )
  }

  return (
    <Fragment>
      { initialized && renderNav() }
      <ScreenTitle>Settings</ScreenTitle>
      { !initialized && renderWelcomeText() }
      <dl className="settings">
        { settings.map((setting) => <SettingForm { ...{ setting, onSave: saveSetting, key: setting.name } } />) }
      </dl>
    </Fragment>
  )
}

export default Settings
