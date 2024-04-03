import express from 'express'
import { loginValidation, registerValidation } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controller'

const usersRoutes = express.Router()

usersRoutes.post('/login', loginValidation, loginController)

/**
 * Description: Register a new user
 * Route: POST /register
 * Request body: { name: string, email: string, password: string, confirm_password:  string, date_of_birth: ISODate}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
usersRoutes.post('/register', registerValidation, registerController)

export default usersRoutes
