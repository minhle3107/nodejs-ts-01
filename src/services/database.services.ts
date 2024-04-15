import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import * as process from 'process'
import User from '~/models/shcemas/User.schema'
import RefreshToken from '~/models/shcemas/RefreshToken.schema'

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

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  async disconnect() {
    try {
      await this.client.close()
      console.log('Disconnected from MongoDB!')
    } catch (e) {
      console.error('Unable to disconnect from MongoDB')
      console.error(e)
      throw e
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
