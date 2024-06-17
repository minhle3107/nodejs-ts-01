import express from 'express'
import { searchController } from '~/controllers/search.controllers'

const searchRoutes = express.Router()

searchRoutes.get('/', searchController)

export default searchRoutes
