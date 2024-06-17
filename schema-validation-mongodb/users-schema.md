```json
{
  $jsonSchema: {
    bsonType: 'object',
    title: 'Users object validation',
    required: [
      '_id',
      'name',
      'email',
      'date_of_birth',
      'password',
      'created_at',
      'updated_at',
      'email_verify_token',
      'forgot_password_token',
      'verify_status',
      'bio',
      'location',
      'website',
      'username',
      'avatar',
      'cover_photo'
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: '\'_id\' is optional and must be a valid ObjectId'
      },
      name: {
        bsonType: 'string',
        description: '\'name\' is required and must be a string'
      },
      email: {
        bsonType: 'string',
        description: '\'email\' is required and must be a string'
      },
      date_of_birth: {
        bsonType: 'date',
        description: '\'date_of_birth\' is required and must be a valid date'
      },
      password: {
        bsonType: 'string',
        description: '\'password\' is required and must be a string'
      },
      created_at: {
        bsonType: 'date',
        description: '\'created_at\' is optional and must be a valid date'
      },
      updated_at: {
        bsonType: 'date',
        description: '\'updated_at\' is optional and must be a valid date'
      },
      email_verify_token: {
        bsonType: 'string',
        description: '\'email_verify_token\' is optional and must be a string'
      },
      forgot_password_token: {
        bsonType: 'string',
        description: '\'forgot_password_token\' is optional and must be a string'
      },
      verify_status: {
        'enum': [
          0,
          1,
          2
        ],
        description: '\'verify_status\' is optional and must be one of the states defined in EnumUserVerifyStatus'
      },
      bio: {
        bsonType: 'string',
        description: '\'bio\' is optional and must be a string'
      },
      location: {
        bsonType: 'string',
        description: '\'location\' is optional and must be a string'
      },
      website: {
        bsonType: 'string',
        description: '\'website\' is optional and must be a string'
      },
      username: {
        bsonType: 'string',
        description: '\'username\' is optional and must be a string'
      },
      avatar: {
        bsonType: 'string',
        description: '\'avatar\' is optional and must be a string'
      },
      cover_photo: {
        bsonType: 'string',
        description: '\'cover_photo\' is optional and must be a string'
      }
    },
    additionalProperties: false
  }
}
```