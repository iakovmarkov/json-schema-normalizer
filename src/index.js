import Ajv from 'ajv'
import curry from './curry'

import _loadSchemas from './loadSchemas'
import _normalize from './normalize'
import _denormalize from './denormalize'

const defaultAjvConfig = {
  schemaId: 'title',
  allErrors: true,
  verbose: true,
  removeAdditional: 'failing',
  useDefaults: true
}

let store

const reset = () => {
  store = {
    ajv: new Ajv(defaultAjvConfig),
    schemas: {}
  }
}

const loadSchemas = jsonSchemas => _loadSchemas(jsonSchemas, store)

const normalize = curry((modelName, data) => _normalize(modelName, data, store))

const denormalize = curry((schemaName, data, entities) =>
  _denormalize(schemaName, data, entities, store)
)

reset()

export { loadSchemas, normalize, denormalize, reset }
