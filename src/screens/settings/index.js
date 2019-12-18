import React from 'react'
import { CommonScreenLayout } from 'layouts'
import { Settings } from './components'
import { list as getSettingsList, isAppInitialized } from 'libs/config'

const layoutOptions = {
  screenTitle: 'Settings',
  leftNav: ['back'],
  rightNav: [],
}

const SettingsScreen = () => {
  return (
    <CommonScreenLayout { ...layoutOptions }>
      <Settings settings={ getSettingsList() } initialized={ isAppInitialized() } />
    </CommonScreenLayout>
  )
}

export default SettingsScreen
