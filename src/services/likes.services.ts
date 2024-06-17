import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import Like from '~/models/shcemas/Like.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    return await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
  }

  async unLikeTweet(user_id: string, tweet_id: string) {
    return await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
  }
}

const likesService = new LikeService()
export default likesService
