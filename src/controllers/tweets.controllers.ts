import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestsBody } from '~/models/requests/Tweet.requests'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestsBody>,
  res: Response,
  next: NextFunction
) => {
  return res.send('Create tweet successfully')
}
