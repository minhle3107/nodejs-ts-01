import { TweetRequestsBody } from '~/models/requests/Tweet.requests'
import databaseService from '~/services/database.services'
import Tweet from '~/models/shcemas/Tweet.schema'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/shcemas/Hashtag.schema'
import { EnumTweetType } from '~/constants/enums'

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
          guest_views: 1,
          updated_at: 1
        }
      }
    )
  }

  async getTweetChildren({
    tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  }: {
    tweet_id: string
    tweet_type: EnumTweetType
    limit: number
    page: number
    user_id?: string
  }) {
    const tweets = await databaseService.tweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id: new ObjectId(tweet_id),
            type: tweet_type
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mention',
                in: {
                  _id: '$$mention._id',
                  name: '$$mention.name',
                  username: '$$mention.username',
                  email: '$$mention.email'
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'tweet_children'
          }
        },
        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },
            likes: {
              $size: '$likes'
            },
            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', EnumTweetType.Retweet]
                  }
                }
              }
            },
            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', EnumTweetType.Comment]
                  }
                }
              }
            },
            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', EnumTweetType.QuoteTweet]
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            tweet_children: 0
          }
        },
        {
          $skip: limit * (page - 1) // Công thức phân trang, vd: 5 * (3 - 1) bắt đầu tù 11
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const ids = tweets.map((tweet) => tweet._id as ObjectId)
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const date = new Date()

    const [, total] = await Promise.all([
      databaseService.tweets.updateMany(
        // updateMany k return
        { _id: { $in: ids } },
        {
          $inc: inc,
          $set: { updated_at: date }
        }
      ),
      await databaseService.tweets.countDocuments({
        parent_id: new ObjectId(tweet_id),
        type: tweet_type
      })
    ])

    tweets.forEach((tweet) => {
      tweet.updated_at = date
      if (user_id) {
        tweet.user_views += 1
      } else {
        tweet.guest_views += 1
      }
    })

    return {
      tweets,
      total
    }
  }
}

export default new TweetsService()
