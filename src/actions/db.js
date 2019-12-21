import { isEmpty } from 'lodash'
import { db as opDb } from 'operations'
import { Dropbox as DropboxLib } from 'dropbox'
import { get as getConfigParam } from 'libs/config'
import signals from 'libs/signals'

const Dropbox = new DropboxLib({ accessToken: getConfigParam('recapitulationDropboxAccessToken'), fetch })

const loadFile = () => (dispatch) => {
  const onSuccess = (response) => {
    new Response(response.fileBlob).arrayBuffer().then((dbFileContent) => {
      dispatch(signals.dbFileRecieved(response))
      opDb.init(dbFileContent).then((db) => {
        // localStorage.setItem('dbFileContent', dbFileContent) /* put db to cache */
        dispatch(signals.dbFileSynced(db))
      })
    })
  }
  const onError = (response) => {
    switch (response.status) {
      case 409:
        opDb.init([]).then((db) => dispatch(syncFile(db)))
        break
      default:
        dispatch(signals.errorReceived(response))
    }
  }
  // const content = localStorage.getItem('dbFileContent') /* get db from cache */
  const content = null
  if (!isEmpty(content)) { /* init db from cache */
    opDb.init(content).then((db) => {
      dispatch(signals.dbFileSynced(db))
    })
  } else {
    return Dropbox.filesDownload({path: getConfigParam('recapitulationDropboxDbFileName')}).then(onSuccess, onError)
  }
}

const syncFile = (db) => (dispatch) => {
  const dbFileContent = db.export().buffer;
  const onSuccess = (response) => {
    dispatch(signals.dbFileRecieved(response))
    dispatch(signals.dbFileSynced(db))
    // localStorage.removeItem('dbFileContent') /* db cache */
  }
  const onError = (response, dispatch) => {
    dispatch(signals.errorReceived(response))
  }
  const args = { contents: dbFileContent, path: getConfigParam('recapitulationDropboxDbFileName'), mode: 'overwrite' }
  return Dropbox.filesUpload(args).then(onSuccess, onError)
}

export {
  loadFile,
  syncFile
}
