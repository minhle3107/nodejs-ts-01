import { EnumMediaType, EnumTweetAudience, EnumTweetType } from '~/constants/enums'

export interface TweetRequestsBody {
  type: EnumTweetType
  audience: EnumTweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: EnumMediaType[]
}
