import { EnumMediaType, EnumTweetAudience, EnumTweetType } from '~/constants/enums'
import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface TweetRequestsBody {
  type: EnumTweetType
  audience: EnumTweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: EnumMediaType[]
}

export interface ITweetParam extends ParamsDictionary {
  tweet_id: string
}

export interface ITweetQuery extends Query {
  limit: string
  page: string
  tweet_type: string
}
