import { every, isEmpty } from 'lodash'

const settings = [
  { title: 'Dropbox Access Token', name: 'recapitulationDropboxAccessToken' },
  { title: 'Database File Name', name: 'recapitulationDropboxDbFileName' }
]
const mapValues = (setting) => ({ ...setting, value: (localStorage.getItem(setting.name) || '') })

const save = (setting) => localStorage.setItem(setting.name, setting.value)
const get = (settingName) => localStorage.getItem(settingName)
const list = () => settings.map(mapValues)
const isAppInitialized = () => every(list(), (setting) => !isEmpty(setting.value))

export {
  save,
  get,
  list,
  isAppInitialized
}
