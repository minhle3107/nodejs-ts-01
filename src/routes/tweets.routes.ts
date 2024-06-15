import express from 'express'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'
import { createTweetController, getTweetController } from '~/controllers/tweets.controllers'
import { audienceValidator, createTweetValidator, tweetIdValidator } from '~/middlewares/tweets.middlewares'

const tweetsRoutes = express.Router()

/**
 * Description: Register a new user
 * Route: POST /register
 * Request body: { name: string, email: string, password: string, confirm_password:  string, date_of_birth: ISODate}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
tweetsRoutes.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestsHandler(createTweetController)
)

/**
 * Description: Get tweet detail
 * Route: POST /:tweet_id
 * Header: { Authorization: Bearer <access_token> }
 * Response: { message: string }
 * Error: { error: string }
 *
 */
tweetsRoutes.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestsHandler(getTweetController)
)
export default tweetsRoutes
