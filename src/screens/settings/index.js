import React from 'react'
import { Screen } from 'components'
import { Settings } from './components'
import { list as getSettingsList, isAppInitialized } from 'libs/config'

const SettingsScreen = () => {
  return (
    <Screen className="settings">
      <Settings settings={ getSettingsList() } initialized={ isAppInitialized() } />
    </Screen>
  )
}

export default SettingsScreen
