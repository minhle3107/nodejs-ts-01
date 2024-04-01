import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@twitter.rifbmvv.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient = new MongoClient(uri)

  async connect() {
    try {
      await this.client.db('admin').command({ ping: 1 })
      console.log('Connected to MongoDB!')
    } finally {
      await this.client.close()
    }
  }
}

export default new DatabaseService()
