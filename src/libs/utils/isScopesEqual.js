import { isEmpty, has } from 'lodash'

const isScopesEqual = (nextScope, prevScope) => {
  const bothEmpty = isEmpty(nextScope) && isEmpty(prevScope)
  const bothHasUUID = has(nextScope, 'uuid') && has(prevScope, 'uuid')

  return (bothHasUUID && nextScope.uuid == prevScope.uuid) || bothEmpty
}

export default isScopesEqual
