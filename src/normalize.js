import { normalize as libNormalize } from 'normalizr'
import debug from './debug'

const normalize = (schemaName, data, store) => {
  const schema = store.schemas[schemaName]
  const isArray = Array.isArray(data)

  data = isArray ? [...data] : { ...data } // AJV will mutate it, we'll do a copy

  if (!schema) {
    throw new Error(`Schema "${schemaName}" is not defined!`)
  }

  debug(`Normalizing "${schemaName}":`)
  debug(data)

  if (isArray) {
    data.forEach(item => {
      const isValid = store.ajv.validate(schemaName, item)
      if (!isValid) {
        throw new Error(store.ajv.errorsText())
      }
    })
  } else {
    const isValid = store.ajv.validate(schemaName, data)
    if (!isValid) {
      throw new Error(store.ajv.errorsText())
    }
  }

  return libNormalize(data, isArray ? [schema] : schema)
}

export default normalize
