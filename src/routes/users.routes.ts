import express from 'express'
import { loginValidation, registerValidation } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controller'

const usersRoutes = express.Router()

usersRoutes.post('/login', loginValidation, loginController)
usersRoutes.post('/register', registerValidation, registerController)

export default usersRoutes
