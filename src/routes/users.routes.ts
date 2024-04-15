import express from 'express'
import { accessTokenValidation, loginValidation, registerValidation } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controller'
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

usersRoutes.post('/register', registerValidation, wrapRequestsHandler(registerController))

/**
 * Description: Login
 * Route: POST /login
 * Request body: { email: string, password: string}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
usersRoutes.post('/login', loginValidation, wrapRequestsHandler(loginController))

/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { refresh-token}
 * Response: { message: string }
 * Error: { error: string }
 */

usersRoutes.post('/logout', accessTokenValidation, (req, res) => {
  res.json({ message: 'Logout successfully' })
})

export default usersRoutes
