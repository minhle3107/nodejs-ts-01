import databaseService from '~/services/database.services'

class SearchService {
  async search({ content, limit, page }: { content: string; limit: number; page: number }) {
    return await databaseService.tweets
      .find({
        $text: {
          $search: content
        }
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
  }
}

const searchService = new SearchService()
export default searchService
