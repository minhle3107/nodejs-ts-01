import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ISearchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, any, ISearchQuery>, res: Response) => {
  const content = req.query.content
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await searchService.search({ content, limit, page })
  return res.json({
    message: 'ok',
    result: result
  })
}
