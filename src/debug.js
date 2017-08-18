const debug = process.env.DEBUG
  ? require('debug')('json-schema-normalizer')
  : () => undefined

export default debug
