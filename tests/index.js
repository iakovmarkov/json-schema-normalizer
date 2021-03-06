import test from 'tape'
import fixtures from './fixtures'
import { loadSchemas, normalize, denormalize, reset } from '../src'

test('Normalizing a flat schema', t => {
  t.test('Valid data', t => {
    reset()
    loadSchemas([fixtures.Person])
    const data = normalize('Person', {
      id: 515,
      firstName: 'John',
      lastName: 'Doe'
    })

    t.deepEqual(
      data,
      {
        entities: {
          Person: {
            515: {
              id: 515,
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        },
        result: 515
      },
      'Normalized valid flat data successfully'
    )

    t.end()
  })

  t.test('Additional props', t => {
    reset()
    loadSchemas([fixtures.Person])
    const data = normalize('Person', {
      id: 515,
      firstName: 'John',
      lastName: 'Doe',
      height: 185,
      weight: 90
    })

    t.deepEqual(
      data,
      {
        entities: {
          Person: {
            515: {
              id: 515,
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        },
        result: 515
      },
      'Stripped additional props'
    )

    t.end()
  })

  t.test('Invalid data', t => {
    reset()
    loadSchemas([fixtures.Person])
    t.throws(
      () => normalize({ id: '515', firstName: null }, 'Person'),
      Error,
      'Throws an exception on invalid data'
    )

    t.end()
  })
})

test('Normalizing a nested schema', t => {
  const validPost = {
    id: 42,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum dolor sit amet.',
    author: { id: 515, firstName: 'John', lastName: 'Doe' },
    comments: [
      {
        id: 1,
        content: 'This is really good',
        author: { id: 313, firstName: 'Jane', lastName: 'Doe' }
      },
      {
        id: 2,
        content: 'So helpful, much wow',
        author: { id: 211, firstName: 'John', lastName: 'Snow' }
      },
      {
        id: 3,
        content: 'Thanks for the kind words',
        author: { id: 515, firstName: 'John', lastName: 'Doe' }
      }
    ]
  }

  t.test('Valid data', t => {
    reset()
    loadSchemas([fixtures.Person, fixtures.Post, fixtures.Comment])
    const data = normalize('Post', validPost)

    t.deepEqual(
      data,
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
      },
      'Normalized valid deep nested data successfully'
    )

    t.end()
  })

  t.test('Unknown reference', t => {
    t.throws(
      () => {
        reset()
        loadSchemas([fixtures.Post])
      },
      Error,
      'Throws an exception when schemas contain reference to undefined schema'
    )

    t.end()
  })

  t.test("Schema containing 'allOf'", t => {
    const post = { ...validPost, tags: ['lorem', 'ipsum'] }
    reset()
    loadSchemas([
      fixtures.Person,
      fixtures.Post,
      fixtures.PostWithTags,
      fixtures.Comment
    ])
    const data = normalize('Post', post)

    t.deepEqual(
      data,
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
      },
      'Normalized valid deep nested data with `allOf` successfully'
    )

    t.end()
  })
})

test('Denormalizing data', t => {
  t.test('Denormalizing single entity', t => {
    reset()
    loadSchemas([fixtures.Person, fixtures.Post, fixtures.Comment])

    const entities = {
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
    }

    const normalizedData = 42

    const denormalized = denormalize('Post', normalizedData, entities)

    t.deepEqual(denormalized, {
      Post: {
        id: 42,
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet.',
        author: { id: 515, firstName: 'John', lastName: 'Doe' },
        comments: [
          {
            id: 1,
            content: 'This is really good',
            author: { id: 313, firstName: 'Jane', lastName: 'Doe' }
          },
          {
            id: 2,
            content: 'So helpful, much wow',
            author: { id: 211, firstName: 'John', lastName: 'Snow' }
          },
          {
            id: 3,
            content: 'Thanks for the kind words',
            author: { id: 515, firstName: 'John', lastName: 'Doe' }
          }
        ]
      }
    })

    t.end()
  })

  t.test('Denormalizing collection', t => {
    reset()
    loadSchemas([fixtures.Person])

    const entities = {
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
      }
    }

    const normalizedData = [211, 313, 515]

    const denormalized = denormalize('Person', normalizedData, entities)

    t.deepEqual(denormalized, {
      Person: [
        { id: 211, firstName: 'John', lastName: 'Snow' },
        { id: 313, firstName: 'Jane', lastName: 'Doe' },
        { id: 515, firstName: 'John', lastName: 'Doe' }
      ]
    })

    t.end()
  })
})
