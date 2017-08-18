import debug from './debug'
import { schema as Schema } from 'normalizr'

const loadSchemas = (jsonSchemas, store) => {
  jsonSchemas.forEach(schema => {
    const { title } = schema
    debug(`Adding ${title} to AJV & Schemas`)
    store.ajv.addSchema(schema, title)
    store.schemas[title] = parseJsonSchema(schema, jsonSchemas, store)
  })
}

const parseJsonSchema = (schema, jsonSchemas, store) => {
  const { title, properties, allOf, oneOf, anyOf } = schema

  if (allOf) {
    console.warn(
      `Schema '${title}' has 'allOf' property. It's not yet implemented. '${title}' will be defined as plain Entity.`
    )
    return new Schema.Entity(title)
  }

  if (anyOf || oneOf) {
    console.warn(
      `Schema '${title}' has 'anyOf' or 'oneOf' property. It's not supported. '${title}' will be defined as plain Entity.`
    )
    return new Schema.Entity(title)
  }

  return new Schema.Entity(
    title,
    Object.getOwnPropertyNames(properties).reduce((definitions, key) => {
      const { $ref, type, items } = properties[key]

      if ($ref) {
        const resolvedSchema = resolveSchema($ref, jsonSchemas, store)
        definitions = { ...definitions, [key]: resolvedSchema }
      } else if (type === 'array' && items && items.$ref) {
        const resolvedSchema = resolveSchema(items.$ref, jsonSchemas, store)

        definitions = {
          ...definitions,
          [key]: new Schema.Array(resolvedSchema)
        }
      }

      return definitions
    }, {})
  )
}

const resolveSchema = (schemaName, jsonSchemas, store) => {
  if (store.schemas[schemaName]) {
    return store.schemas[schemaName]
  } else {
    debug(
      `Schema '${schemaName}' is not defined yet. Trying to find it in raw schemas array and define it.`
    )

    const foundSchema = jsonSchemas.reduce(
      (result, schema) => (schema.title === schemaName ? schema : undefined),
      undefined
    )

    if (!foundSchema) {
      throw new Error(
        `Schema ${schemaName} cannot be defined! Some other schema referenced it, but it was not defined.`
      )
    }

    const schema = parseJsonSchema(foundSchema, jsonSchemas, store)
    store.schemas[schemaName] = schema

    debug(`Schema '${schemaName}' was found and added to collection.`)

    return schema
  }
}

export default loadSchemas
