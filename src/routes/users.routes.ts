import express from 'express'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { loginController, logoutController, registerController } from '~/controllers/users.controller'
import { wrapRequestsHandler } from '~/utils/handlers'

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

export default usersRoutes
