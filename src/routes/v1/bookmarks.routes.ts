import { Router } from 'express'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'
import {
  bookmarksControllers,
  unBookmarksByBookmarkIdControllers,
  unBookmarksControllers
} from '~/controllers/bookmarks.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'

const bookmarksRoutes = Router()

/**
 * Description: Bookmark a tweet
 * Route: POST /
 * Request body: { user_id: string, tweet_id: string}
 * Response: { message: string }
 * Error: { error: string }
 *
 */
bookmarksRoutes.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestsHandler(bookmarksControllers)
)

/**
 * Description: Unbookmark a tweet
 * Route: POST /:tweet_id
 * Response: { message: string }
 * Error: { error: string }
 *
 */
bookmarksRoutes.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestsHandler(unBookmarksControllers)
)

/**
 * Description: Unbookmark a tweet
 * Route: POST /:tweet_id
 * Response: { message: string }
 * Error: { error: string }
 *
 */
bookmarksRoutes.delete(
  '/:bookmark_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(unBookmarksByBookmarkIdControllers)
)

export default bookmarksRoutes
