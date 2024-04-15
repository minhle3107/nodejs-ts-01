const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',

  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_LEFT_SIDE_IS_INVALID:
    'The left side of the email must only contain letters (a-z, A-Z), numbers (0-9), and periods (.)',
  EMAIL_RIGHT_SIDE_IS_INVALID: 'The right side of the email must be in the correct email format',
  EMAIL_ALREADY_EXISTS: 'Email already exists',

  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_BETWEEN_2_AND_255: 'Name must be between 2 and 255 characters',

  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50: 'Password must be at least 6 characters long and less than 50 characters',
  PASSWORD_MUST_BE_STRONG:
    'Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol',

  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_BETWEEN_6_AND_50:
    'Confirm password must be at least 6 characters long and less than 50 characters',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_DOES_NOT_MATCH: 'Passwords do not match',

  DATE_OF_BIRTH_MUST_BE_A_VALID_ISO_DATE: 'Date of birth must be a valid ISODate',

  RESIGNED_SUCCESSFULLY: 'Resigned successfully',

  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',

  USER_NOT_FOUND: 'User not found',

  LOGIN_FAILED: 'Login failed',
  LOGIN_SUCCESSFULLY: 'Login successfully'
} as const
export default USERS_MESSAGES
