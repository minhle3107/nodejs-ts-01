import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import Bookmark from '~/models/shcemas/Bookmark.schema'

class BookmarksService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    return await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
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

  async unBookmarkTweet(user_id: string, tweet_id: string) {
    return await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
  }

  async unBookmarkTweetByBookmarkId(user_id: string, bookmark_id: string) {
    return await databaseService.bookmarks.findOneAndDelete({
      _id: new ObjectId(bookmark_id),
      user_id: new ObjectId(user_id)
    })
  }
}

const bookmarksService = new BookmarksService()
export default bookmarksService
