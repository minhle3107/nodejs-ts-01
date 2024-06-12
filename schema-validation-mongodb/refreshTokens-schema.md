```json
{
  $jsonSchema: {
    bsonType: 'object',
    title: 'Refresh Token object validation',
    required: [
      '_id',
      'token',
      'user_id',
      'created_at',
      'iat',
      'exp'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: '\'_id\' must be a ObjectId and is required'
      },
      token: {
        bsonType: 'string',
        description: '\'name\' must be a string and is required'
      },
      user_id: {
        bsonType: 'objectId',
        description: '\'user_id\' must be a ObjectId and is required'
      },
      created_at: {
        bsonType: 'date',
        description: '\'created_atat\' must be a ISODate(\'date\') and is required'
      },
      iat: {
        bsonType: 'date',
        description: '\'iat\' must be a date and is required'
      },
      exp: {
        bsonType: 'date',
        description: '\'iat\' must be a date and is required'
      }
    },
    additionalProperties: false
  }
}
```