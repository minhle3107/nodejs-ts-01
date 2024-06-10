import express from 'express'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'
import { createTweetController } from '~/controllers/tweets.controllers'

const tweetsRoutes = express.Router()

/**
 * Description: Register a new user
 * Route: POST /register
 * Request body: { name: string, email: string, password: string, confirm_password:  string, date_of_birth: ISODate}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
tweetsRoutes.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestsHandler(createTweetController))
export default tweetsRoutes
