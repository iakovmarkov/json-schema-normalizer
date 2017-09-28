# JSON Schema Normalizer

## What?
JSON Schema Normalizer is a small library built on top of [ajv](https://github.com/epoberezkin/ajv)
and [normalizr](https://github.com/paularmstrong/normalizr). It seamlessly merges the functionality of
those two libraries, allowing you to validate & normalize your data by JSON Schema.

## Why?
Because writing Normalizr schemas is not fun. JSON Schema is a widely supported standard, and most ORMs
can export their models as JSON Schemas. This library allows you to load auto-generated schemas and use them
to validate and normalize your data, saving you a ton of time.

## Installation

    npm install --save json-schema-normalizer
    
## Usage
Consider your API returns the following blog post:
```json
{
  "id": 42,
  "title": "Lorem Ipsum",
  "content": "Lorem ipsum dolor sit amet.",
  "author": {
    "id": 515,
    "firstName": "John",
    "lastName": "Doe"
  },
  "comments": [
    {
      "id": 1,
      "content": "This is really good",
      "author": {
        "id": 313,
        "firstName": "Jane",
        "lastName": "Doe"
      }
    },
    {
      "id": 2,
      "content": "So helpful, much wow",
      "author": {
        "id": 211,
        "firstName": "John",
        "lastName": "Snow"
      }
    },
    {
      "id": 3,
      "content": "Thanks for the kind words",
      "author": {
        "id": 515,
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "tags": [
    "lorem",
    "ipsum"
  ]
}
```

We've got a few entity types: `Post` itself, a `User`, and a `Comment`.
Now, our API also gives us JSON Schemas for all those entity types:

```json
{
  "title": "Post",
  "type": "object",
  "description": "A blog post containing title, content, author & comments",
  "required": [
    "id",
    "title",
    "author"
  ],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "integer"
    },
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "author": {
      "$ref": "Person"
    },
    "comments": {
      "type": "array",
      "items": {
        "$ref": "Comment"
      }
    }
  }
}
```
```json
{
  "title": "Comment",
  "type": "object",
  "description": "A comment containing content & author",
  "required": [
    "id",
    "author",
    "content"
  ],
  "properties": {
    "id": {
      "type": "integer"
    },
    "content": {
      "type": "string"
    },
    "author": {
      "$ref": "Person"
    }
  }
}
```

Using this library, you can validate & normalize your data like this:
```js
// Import library
const { loadSchemas, normalize } = require('json-schema-normalizer')

// Pass an array of schemas to define them
loadSchemas([personSchema, postSchema, commentSchema])

// Then call normalize with schema name & your denormalized data
const normalizedData = normalize('Post', rawData)
```

That will give you the normal normalizr output:
```js
{
  entities: {
    Person: {
      515: {
        id: 515,
          firstName: 'John',
          lastName: 'Doe'
      },
      211: {
        id: 211,
          firstName: 'John',
          lastName: 'Snow'
      },
      313: {
        id: 313,
          firstName: 'Jane',
          lastName: 'Doe'
      }
    },
    Post: {
      42: {
        id: 42,
          title: 'Lorem Ipsum',
          content: 'Lorem ipsum dolor sit amet.',
          author: 515,
          comments: [1, 2, 3]
      }
    },
    Comment: {
      1: { id: 1, content: 'This is really good', author: 313 },
      2: { id: 2, content: 'So helpful, much wow', author: 211 },
      3: { id: 3, content: 'Thanks for the kind words', author: 515 }
    }
  },
  result: 42
}
```

Look into `tests/index.js` for more examples.

## API

### `loadSchemas(schemas: Array<object>): void`
Loads an array of schemas into AJV and parses them for usage in Normalizr.

You probably need to call it only once when you get your schemas from API
or load them from some file.

### `normalize(schemaName: string, data: any): object`
Validates your data against JSON Schema using AJV and normalizes it using Normalizr.

Returned value is exactly the same as return value in Normalizr.

### `init(): void`

A function that removes AJV schemas and parsen Normalizr schemas.

You probably won't need it, it is used in tests to reset storage after each test.
    
## Caveats
In order to work, this library requires your JSON Schemas to have a `title` property,
that will be a unique name of this schema. It is used to store Normalizer schemas and
to get JSON Schema for AJV validation.

## Dependencies
- [ajv](https://github.com/epoberezkin/ajv)
- [normalizr](https://github.com/paularmstrong/normalizr)