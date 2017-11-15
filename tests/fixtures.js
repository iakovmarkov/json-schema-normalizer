export const Person = {
  title: 'Person',
  type: 'object',
  required: ['id', 'firstName', 'lastName'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'integer'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    age: {
      description: 'Age in years',
      type: 'integer',
      minimum: 0
    }
  }
}

export const Post = {
  title: 'Post',
  type: 'object',
  description: 'A blog post containing title, content, author & comments',
  required: ['id', 'title', 'author'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'integer'
    },
    title: {
      type: 'string'
    },
    content: {
      type: 'string'
    },
    author: {
      $ref: '#/definitions/Person'
    },
    comments: {
      type: 'array',
      items: {
        $ref: '#/definitions/Comment'
      }
    }
  }
}

export const PostWithTags = {
  title: 'PostWithTags',
  allOf: [
    {
      $ref: '#/definitions/Post'
    },
    {
      tags: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  ]
}

export const Comment = {
  title: 'Comment',
  type: 'object',
  description: 'A comment containing content & author',
  required: ['id', 'author', 'content'],
  properties: {
    id: {
      type: 'integer'
    },
    content: {
      type: 'string'
    },
    author: {
      $ref: '#/definitions/Person'
    }
  }
}

export default { Person, Post, Comment, PostWithTags }
