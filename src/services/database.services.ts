import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/shcemas/User.schema'
import RefreshToken from '~/models/shcemas/RefreshToken.schema'
import Follower from '~/models/shcemas/Follower.schema'
import VideoStatus from '~/models/shcemas/VideoStatus.schema'
import Tweet from '~/models/shcemas/Tweet.schema'
import Hashtag from '~/models/shcemas/Hashtag.schema'
import Bookmark from '~/models/shcemas/Bookmark.schema'
import Like from '~/models/shcemas/Like.schema'
import { envConfig } from '~/constants/config'

// const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPass}@twitter.rifbmvv.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPass}@learning.abdluxx.mongodb.net/?retryWrites=true&w=majority&appName=Learning`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
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

  async indexTweets() {
    if (!(await this.tweets.indexExists('content_text'))) {
      await this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUserCollection)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection)
  }

  async initializeDatabase() {
    try {
      await this.connect()
      await Promise.all([
        this.indexUsers(),
        this.indexRefreshTokens(),
        this.indexVideoStatus(),
        this.indexFollowers(),
        this.indexTweets()
        // Include additional indexing methods as needed...
      ])
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
