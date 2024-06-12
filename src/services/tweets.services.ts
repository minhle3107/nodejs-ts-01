import { TweetRequestsBody } from '~/models/requests/Tweet.requests'
import databaseService from '~/services/database.services'
import Tweet from '~/models/shcemas/Tweet.schema'
import { ObjectId } from 'mongodb'

class TweetsService {
  async createTweet(user_id: string, body: TweetRequestsBody) {
    const tweet = new Tweet({
      audience: body.audience,
      content: body.content,
      type: body.type,
      parent_id: body.parent_id,
      hashtags: [],
      mentions: body.mentions,
      medias: body.medias,
      user_id: new ObjectId(user_id)
    })

    await databaseService.tweets.insertOne(tweet)
    return tweet
  }
}

export default new TweetsService()
