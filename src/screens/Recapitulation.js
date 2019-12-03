import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { getFromCompartment } from 'reducers'
import { useRouter } from 'routes'
import { isAppInitialized } from 'config'
import { InitDbScreen, SettingsScreen } from 'screens'

const Recapitulation = () => {
  const noDB = isEmpty(useSelector(getFromCompartment('db')))
  const { currentComponent } = useRouter()
  const CurrentScreen = isAppInitialized() ? currentComponent : SettingsScreen

  return isAppInitialized() && noDB ? <InitDbScreen /> : <CurrentScreen />
};

export default Recapitulation
