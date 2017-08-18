import { normalize as libNormalize } from 'normalizr'
import debug from './debug'

const normalize = (schemaName, data, store) => {
  const schema = store.schemas[schemaName]
  data = { ...data } // AJV will mutate it, we'll do a copy
  if (!schema) {
    throw new Error(`Schema "${schemaName}" is not defined!`)
  }
  debug(`Normalizing "${schemaName}":`)
  debug(data)
  const isValid = store.ajv.validate(schemaName, data)
  if (!isValid) {
    throw new Error(isValid)
  }
  return libNormalize(data, schema)
}

export default normalize
