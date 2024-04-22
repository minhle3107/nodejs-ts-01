import express from 'express'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { wrapRequestsHandler } from '~/utils/handlers'
import { filterMiddlewares } from '~/middlewares/common.middlewares'
import { IUpdateMeReqBody } from '~/models/requests/User.requests'

const usersRoutes = express.Router()

/**
 * Description: Register a new user
 * Route: POST /register
 * Request body: { name: string, email: string, password: string, confirm_password:  string, date_of_birth: ISODate}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
usersRoutes.post('/register', registerValidator, wrapRequestsHandler(registerController))

/**
 * Description: Login
 * Route: POST /login
 * Request body: { email: string, password: string}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
usersRoutes.post('/login', loginValidator, wrapRequestsHandler(loginController))

/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { refresh-token}
 * Response: { message: string }
 * Error: { error: string }
 */
usersRoutes.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestsHandler(logoutController))

/**
 * Description: Verify user email when user clicks on the link sent to their email
 * Path: /verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { email_verified_token: string }
 * Response: { message: string }
 * Error: { error: string }
 */
usersRoutes.post('/verify-email', emailVerifyTokenValidator, wrapRequestsHandler(verifyEmailController))

/**
 * Description: Resend verify email token to user email when user clicks on the link sent to their email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: {  }
 * Response: { message: string }
 * Error: { error: string }
 */
usersRoutes.post('/resend-verify-email', accessTokenValidator, wrapRequestsHandler(resendVerifyEmailController))

/**
 * Description: Resend verify email token to user email when user clicks on the link sent to their email
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRoutes.post('/forgot-password', forgotPasswordValidator, wrapRequestsHandler(forgotPasswordController))

/**
 * Description: Verify forgot password token
 * Path: /verify-forgot-password-token
 * Method: POST
 * Body: { forgot-password-token: string }
 */
usersRoutes.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  wrapRequestsHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { forgot-password-token: string, password: string, confirm_password: string}
 */
usersRoutes.post('/reset-password', resetPasswordValidator, wrapRequestsHandler(resetPasswordController))

/**
 * Description: Get my profile
 * Path: /me
 * Header: { Authorization: Bearer <access_token>}
 * Method: GET
 */
usersRoutes.get('/me', accessTokenValidator, wrapRequestsHandler(getMeController))

/**
 * Description: Update my profile
 * Path: /me
 * Header: { Authorization: Bearer <access_token>}
 * Method: PATCH
 Body: UserSchema
 */
usersRoutes.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateValidator,
  filterMiddlewares<IUpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestsHandler(updateMeController)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
usersRoutes.get('/:username', wrapRequestsHandler(getProfileController))

/**
 * Description: Follow user
 * Path: /follow
 * Header: { Authorization: Bearer <access_token>}
 * Body: { follow_user_id: string}
 * Method: POST
 */
usersRoutes.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestsHandler(followController)
)

/**
 * Description: Unfollow user
 * Path: /unfollow/user_id
 * Header: { Authorization: Bearer <access_token>}
 * Method: DELETE
 */
usersRoutes.delete(
  '/unfollow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestsHandler(unfollowController)
)

/**
 * Description: Change password
 * Path: /change-password
 * Header: { Authorization: Bearer <access_token>}
 * Method: PUT
 * Body: { old_password: string, new_password: string, confirm_password: string}
 */
usersRoutes.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestsHandler(changePasswordController)
)
export default usersRoutes
