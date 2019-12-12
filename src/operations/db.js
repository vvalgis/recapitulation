import { values } from 'lodash'
import * as schemas from 'libs/storage/schemas'
import Storage from 'libs/storage/Storage'

const init = async (content) => {
  return Storage().init(new Uint8Array(content)).then((db) => {
    Storage(db).initSchemas(values(schemas))
    return db
  })
}

export {
  init
}
