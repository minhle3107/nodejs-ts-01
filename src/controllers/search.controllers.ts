import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ISearchQuery } from '~/models/requests/Search.requests'
import searchService from '~/services/search.services'
import { SEARCHES_MESSAGES } from '~/constants/messages'
import { EnumPeopleFollow } from '~/constants/enums'

export const searchController = async (req: Request<ParamsDictionary, any, any, ISearchQuery>, res: Response) => {
  const content = req.query.content
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const media_type = req.query.media_type
  const user_id = req.decoded_authorization?.user_id as string
  const people_follow = req.query.people_follow

  const result = await searchService.search({ content, limit, page, media_type, user_id, people_follow })

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
