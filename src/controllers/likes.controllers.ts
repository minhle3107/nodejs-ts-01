import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ITokenPayload } from '~/models/requests/User.requests'
import { LIKES_MESSAGES } from '~/constants/messages'
import { IBookMarkRequestsBody } from '~/models/requests/BookMark.requests'
import likesService from '~/services/likes.services'

export const likeControllers = async (req: Request<ParamsDictionary, any, IBookMarkRequestsBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const result = await likesService.likeTweet(user_id, req.body.tweet_id)

  return res.json({
    message: LIKES_MESSAGES.LIKE_TWEET_SUCCESSFULLY,
    result
  })
}

export const unLikeControllers = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  await likesService.unLikeTweet(user_id, req.params.tweet_id)

  return res.json({
    message: LIKES_MESSAGES.UN_LIKE_SUCCESSFULLY
  })
}
