import { Storage, DataSchema } from 'main'

const init = async (content) => {
  const db = await Storage.init(new Uint8Array(content))
  const storage = Storage.provider(db)
  return storage.isEmpty() ? storage.initSchemas(_.values(DataSchema)) : db
}

export {
  init
}
