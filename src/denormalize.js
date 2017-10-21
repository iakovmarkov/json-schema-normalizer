import { denormalize as libDenormalize } from 'normalizr'
import debug from './debug'

const denormalize = (schemaName, data, entities, store) => {
  const schema = store.schemas[schemaName]
  const isArray = Array.isArray(data)

  if (!schema) {
    throw new Error(`Schema "${schemaName}" is not defined!`)
  }

  debug(`Denormalizing "${schemaName}":`)
  debug(data)

  const input = { [schemaName]: data }
  const finalSchema = isArray
    ? { [schemaName]: [schema] }
    : { [schemaName]: schema }

  const denormalizedData = libDenormalize(input, finalSchema, entities)

  return denormalizedData
}

export default denormalize
