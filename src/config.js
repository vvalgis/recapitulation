const settings = [
  { title: 'Dropbox Access Token', name: 'recapitulationDropboxAccessToken' },
  { title: 'Database File Name', name: 'recapitulationDropboxDbFileName' }
]
const mapValues = (setting) => ({ ...setting, value: (localStorage.getItem(setting.name) || '') })

const save = (setting) => localStorage.setItem(setting.name, setting.value)
const get = (settingName) => localStorage.getItem(settingName)
const list = () => settings.map(mapValues)

export {
  save,
  get,
  list
}
