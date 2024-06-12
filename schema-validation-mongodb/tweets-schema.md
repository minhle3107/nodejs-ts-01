```json
{
  $jsonSchema: {
    bsonType: 'object',
    title: 'Tweets object validation',
    required: [
      '_id',
      'user_id',
      'type',
      'audience',
      'content',
      'parent_id',
      'hashtags',
      'mentions',
      'medias',
      'guest_views',
      'user_views',
      'created_at',
      'updated_at'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: '\'_id\' is optional and must be a valid ObjectId'
      },
      user_id: {
        bsonType: 'objectId',
        description: '\'user_id\' is required and must be a objectId'
      },
      type: {
        bsonType: 'int',
        'enum': [
          0,
          1,
          2,
          3
        ],
        description: '\'type\' is required and must be a TweetType'
      },
      audience: {
        bsonType: 'int',
        'enum': [
          0,
          1
        ],
        description: '\'audience\' is required and must be a TweetAudience'
      },
      content: {
        bsonType: 'string',
        description: '\'content\' is required and must be a string'
      },
      parent_id: {
        bsonType: [
          'null',
          'objectId'
        ],
        description: '\'parent_id\' is required and must be a null or ObjectId'
      },
      hashtags: {
        bsonType: [
          'array'
        ],
        uniqueItems: true,
        additionalProperties: false,
        items: {
          bsonType: 'objectId'
        },
        description: '\'hashtags\' is required and must be a array'
      },
      mentions: {
        bsonType: [
          'array'
        ],
        uniqueItems: true,
        additionalProperties: false,
        items: {
          bsonType: 'objectId'
        },
        description: '\'mentions\' is required and must be a array'
      },
      medias: {
        bsonType: [
          'array'
        ],
        uniqueItems: true,
        additionalProperties: false,
        items: {
          bsonType: 'objectId',
          required: [
            'url',
            'type'
          ],
          additionalProperties: false,
          properties: {
            type: {
              'enum': [
                0,
                1,
                2
              ],
              description: '\'type\' is required and can only be one of te given enum values'
            },
            url: {
              bsonType: 'string',
              description: '\'url\' is required field of type string'
            }
          }
        }
      },
      guest_views: {
        bsonType: 'int',
        minimum: 0,
        description: '\'guest_views\' is required and must be a ObjectId'
      },
      user_views: {
        bsonType: 'int',
        minimum: 0,
        description: '\'user_views\' is required and must be a ObjectId'
      },
      created_at: {
        bsonType: 'date',
        description: '\'created_at\' is optional and must be a valid date'
      },
      updated_at: {
        bsonType: 'date',
        description: '\'updated_at\' is optional and must be a valid date'
      }
    },
    additionalProperties: false
  }
}
```