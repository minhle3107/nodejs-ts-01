import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ISearchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.services'
import { SEARCHES_MESSAGES } from '~/constants/messages'

export const searchController = async (req: Request<ParamsDictionary, any, any, ISearchQuery>, res: Response) => {
  const content = req.query.content
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id as string

  const result = await searchService.search({ content, limit, page, user_id })

  // Kiểm tra nếu không tìm thấy kết quả
  if (result.tweets.length === 0) {
    return res.json({
      message: SEARCHES_MESSAGES.NO_RESULT
    })
  }

  return res.json({
    message: SEARCHES_MESSAGES.SEARCH_SUCCESS,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
