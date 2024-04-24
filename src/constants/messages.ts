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

  DATE_OF_BIRTH_MUST_BE_A_VALID_ISO_DATE: 'Date of birth must be a valid ISO8601',

  RESIGNED_SUCCESSFULLY: 'Resigned successfully',

  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',

  USER_NOT_FOUND: 'User not found',

  LOGIN_FAILED: 'Login failed',
  LOGIN_SUCCESSFULLY: 'Login successfully',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',

  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',

  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',

  LOGOUT_SUCCESSFULLY: 'Logout successfully',

  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFIED_SUCCESSFULLY: 'Email verified successfully',

  RESEND_VERIFY_EMAIL_SUCCESSFULLY: 'Resend verify email successfully',

  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset password',

  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  VERIFY_FORGOT_PASSWORD_SUCCESSFULLY: 'Verify forgot password successfully',
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',

  GET_ME_SUCCESSFULLY: 'Get my profile successfully',
  USER_NOT_VERIFIED: 'User not verified',
  UPDATE_ME_SUCCESSFULLY: 'Update my profile successfully',
  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_LESS_THAN_255: 'Bio must be between 2 and 255 characters',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_LESS_THAN_255: 'Location must be less than 255 characters',
  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_LESS_THAN_255: 'Website must be less than 255 characters',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  USERNAME_IS_INVALID:
    'Username must be between 3 and 15 characters and can only contain letters, numbers, underscores not only numbers',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  IMAGE_MUST_BE_A_STRING: 'Image must be a string',
  IMAGE_LENGTH_MUST_BE_LESS_THAN_400: 'Image must be less than 400 characters',
  GET_PROFILE_SUCCESSFULLY: 'Get profile successfully',
  FOLLOW_USER_SUCCESSFULLY: 'Follow user successfully',
  FOLLOWED_USER_ID_IS_REQUIRED: 'Followed user id is required',
  INVALID_USER_ID: 'Invalid user id',
  FOLLOW_USER_ALREADY: 'Follow user already',
  ALREADY_UNFOLLOWED_USER: 'Already unfollowed user',
  UNFOLLOW_SUCCESSFULLY: 'Unfollow successfully',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Change password successfully',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_IMAGE_SUCCESS: 'Upload image successfully'
} as const
export default USERS_MESSAGES
