import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestsBody } from '~/models/requests/Tweet.requests'
import tweetsService from '~/services/tweets.services'
import { ITokenPayload } from '~/models/requests/User.requests'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { EnumTweetType } from '~/constants/enums'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestsBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as ITokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)

  return res.json({
    message: TWEETS_MESSAGES.TWEET_CREATED_SUCCESSFULLY,
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)

  const tweet = {
    ...req.tweet,
    guest_views: result?.guest_views,
    user_views: result?.user_views
  }
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}

export const getTweetChildrenController = async (req: Request, res: Response) => {
  const tweet_type = Number(req.query.tweet_type as string) as EnumTweetType
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)

  const { tweets, total } = await tweetsService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page
  })
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFULLY,
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit) // ceil làm tròn lên
    }
  })
}
