import Ajv from 'ajv'
import curry from './curry'

import _loadSchemas from './loadSchemas'
import _normalize from './normalize'

const defaultAjvConfig = {
  schemaId: 'title',
  allErrors: true,
  verbose: true,
  removeAdditional: 'failing',
  useDefaults: true
}

let store

const init = () => {
  store = {
    ajv: new Ajv(defaultAjvConfig),
    schemas: {}
  }
}

const loadSchemas = jsonSchemas => _loadSchemas(jsonSchemas, store)

const normalize = curry((modelName, data) => _normalize(modelName, data, store))

init()

export { loadSchemas, normalize, init }
