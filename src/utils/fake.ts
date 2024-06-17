// Mật khẩu cho các face user
import { ObjectId } from 'mongodb'
import { IRegisterReqBody } from '~/models/requests/User.requests'
import { faker } from '@faker-js/faker'
import { TweetRequestsBody } from '~/models/requests/Tweet.requests'
import { EnumTweetAudience, EnumTweetType, EnumUserVerifyStatus } from '~/constants/enums'
import databaseService from '~/services/database.services'
import User from '~/models/shcemas/User.schema'
import { handleHashPassword } from '~/utils/crypto'
import Follower from '~/models/shcemas/Follower.schema'
import tweetsServices from '~/services/tweets.services'

const PASSWORD = 'Admin@123'

// ID của tài khoản của mình, dùng đề follow người khác
const MY_ID = new ObjectId('666e68b4f2700de7ca56be63')

// Số lượng user được tạo, mỗi user sẽ mặc định tweet 2 cái
const USER_COUNT = 100

const createRandomUser = () => {
  const user: IRegisterReqBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
  return user
}

const createRandomTweet = () => {
  const tweet: TweetRequestsBody = {
    type: EnumTweetType.Tweet,
    audience: EnumTweetAudience.Everyone,
    content: faker.lorem.paragraph({ min: 10, max: 166 }),
    hashtags: [],
    medias: [],
    mentions: [],
    parent_id: null
  }
  return tweet
}

const users: IRegisterReqBody[] = faker.helpers.multiple(createRandomUser, { count: USER_COUNT })

const insertMultipleUsers = async (users: IRegisterReqBody[]) => {
  console.log('Creating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user${user_id.toString()}`,
          password: handleHashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify_status: EnumUserVerifyStatus.Verified
        })
      )
      return user_id
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Starting following...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      databaseService.followers.insertOne(
        new Follower({
          user_id,
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
    )
  )
  console.log(`Followed ${result.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  console.log('Counting...')
  let count = 0
  return await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([
        tweetsServices.createTweet(id.toHexString(), createRandomTweet()),
        tweetsServices.createTweet(id.toHexString(), createRandomTweet())
      ])
      count += 2
      console.log(`Created ${count} tweets`)
    })
  )
}

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MY_ID), ids)
  insertMultipleTweets(ids)
})
