import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import * as process from 'process'
import User from '~/models/shcemas/User.schema'
import RefreshToken from '~/models/shcemas/RefreshToken.schema'
import Follower from '~/models/shcemas/Follower.schema'
import VideoStatus from '~/models/shcemas/VideoStatus.schema'
import Tweet from '~/models/shcemas/Tweet.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@twitter.rifbmvv.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (e) {
      console.error('Unable to connect to MongoDB')
      console.error(e)
      throw e
    }
  }

  async indexUsers() {
    if (!(await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1']))) {
      await Promise.all([
        this.users.createIndex({ email: 1, password: 1 }),
        this.users.createIndex({ email: 1 }, { unique: true }),
        this.users.createIndex({ username: 1 }, { unique: true })
      ])
    }
  }

  async indexRefreshTokens() {
    if (!(await this.users.indexExists(['token_1', 'exp_1']))) {
      await Promise.all([
        this.refreshTokens.createIndex({ token: 1 }),
        this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
      ])
    }
  }

  async indexVideoStatus() {
    if (!(await this.videoStatus.indexExists('name_1'))) {
      await this.videoStatus.createIndex({ name: 1 })
    }
  }

  async indexFollowers() {
    if (!(await this.followers.indexExists('user_id_1_followed_user_id_1'))) {
      await this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEETS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
