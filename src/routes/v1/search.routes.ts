import express from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { searchValidator } from '~/middlewares/search.middlewares'
import { paginationValidotor } from '~/middlewares/tweets.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'

const searchRoutes = express.Router()

searchRoutes.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginationValidotor,
  wrapRequestsHandler(searchController)
)

export default searchRoutes
