import express from 'express'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const conversationsRouter = express.Router()

conversationsRouter.get('/receivers/:receiver_id/', accessTokenValidator, verifiedUserValidator)

export default conversationsRouter
