import express from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const searchRoutes = express.Router()

searchRoutes.get('/', accessTokenValidator, verifiedUserValidator, searchController)

export default searchRoutes
