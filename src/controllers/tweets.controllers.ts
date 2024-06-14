import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestsBody } from '~/models/requests/Tweet.requests'
import tweetsService from '~/services/tweets.services'
import { ITokenPayload } from '~/models/requests/User.requests'
import { TWEETS_MESSAGES } from '~/constants/messages'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestsBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)

  return res.json({
    message: TWEETS_MESSAGES.TWEET_CREATED_SUCCESSFULLY,
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get tweet successfully',
    result: 'ok'
  })
}
