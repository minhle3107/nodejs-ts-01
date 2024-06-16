import { TweetRequestsBody } from '~/models/requests/Tweet.requests'
import databaseService from '~/services/database.services'
import Tweet from '~/models/shcemas/Tweet.schema'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/shcemas/Hashtag.schema'

class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagsDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // Tìm hashtag trong database, nếu không tìm thấy thì tạo mới
        return databaseService.hashtags.findOneAndUpdate(
          {
            name: hashtag
          },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )

    return hashtagsDocuments.filter(Boolean).map((hashtag) => (hashtag as WithId<Hashtag>)._id)
  }

  // async checkAndCreateHashtags(hashtags: string[]) {
  //   return Promise.all(
  //     hashtags.map((hashtag) =>
  //       databaseService.hashtags.findOneAndUpdate(
  //         { name: hashtag },
  //         { $setOnInsert: new Hashtag({ name: hashtag }) },
  //         { upsert: true, returnDocument: 'after' }
  //       )
  //     )
  //   ).then((hashtagsDocuments) => hashtagsDocuments.filter(Boolean).map((hashtag) => (hashtag as WithId<Hashtag>)._id))
  // }

  async createTweet(user_id: string, body: TweetRequestsBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    const tweet = new Tweet({
      audience: body.audience,
      content: body.content,
      type: body.type,
      parent_id: body.parent_id,
      hashtags: hashtags,
      mentions: body.mentions,
      medias: body.medias,
      user_id: new ObjectId(user_id)
    })

    await databaseService.tweets.insertOne(tweet)
    return tweet
  }

  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    return await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          user_views: 1,
          guest_views: 1
        }
      }
    )
  }
}

export default new TweetsService()
