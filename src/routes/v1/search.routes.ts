import express from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { searchValidator } from '~/middlewares/search.middlewares'
import { paginationValidotor } from '~/middlewares/tweets.middlewares'

const searchRoutes = express.Router()

searchRoutes.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginationValidotor,
  searchController
)

export default searchRoutes
