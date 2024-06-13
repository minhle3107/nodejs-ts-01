import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ITokenPayload } from '~/models/requests/User.requests'
import { BOOKMARKS_MESSAGES } from '~/constants/messages'
import { IBookMarkRequestsBody } from '~/models/requests/BookMark.requests'
import bookmarksService from '~/services/bookmarks.services'

export const bookmarksControllers = async (
  req: Request<ParamsDictionary, any, IBookMarkRequestsBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const result = await bookmarksService.bookmarkTweet(user_id, req.body.tweet_id)

  return res.json({
    message: BOOKMARKS_MESSAGES.BOOKMARK_CREATED_SUCCESSFULLY,
    result
  })
}

export const unBookmarksControllers = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  await bookmarksService.unBookmarkTweet(user_id, req.params.tweet_id)

  return res.json({
    message: BOOKMARKS_MESSAGES.UNBOOKMARK_SUCCESSFULLY
  })
}

export const unBookmarksByBookmarkIdControllers = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  await bookmarksService.unBookmarkTweetByBookmarkId(user_id, req.params.bookmark_id)

  return res.json({
    message: BOOKMARKS_MESSAGES.UNBOOKMARK_SUCCESSFULLY
  })
}
