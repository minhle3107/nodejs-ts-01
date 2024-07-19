import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { SEARCHES_MESSAGES } from '~/constants/messages'
import { EnumMediaTypeQuery, EnumPeopleFollow } from '~/constants/enums'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SEARCHES_MESSAGES.CONTENT_MUST_BE_A_STRING
        },
        notEmpty: {
          errorMessage: SEARCHES_MESSAGES.CONTENT_IS_REQUIRED
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(EnumMediaTypeQuery)]
        },
        errorMessage: `${SEARCHES_MESSAGES.MEDIA_TYPE_MUST_BE_ONE_OF} ${Object.values(EnumMediaTypeQuery).join(', ')}`
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(EnumPeopleFollow)],
          errorMessage: `${SEARCHES_MESSAGES.PEOPLE_MUST_BE_ONE_OF} ${Object.values(EnumPeopleFollow).join(', ')}`
        }
      }
    },
    ['query']
  )
)
