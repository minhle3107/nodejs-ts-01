import express from 'express'
import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'
import { getConversationsControllers } from '~/controllers/conversations.controllers'
import { paginationValidotor } from '~/middlewares/tweets.middlewares'

const conversationsRouter = express.Router()

conversationsRouter.get(
  '/receivers/:receiver_id/',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidotor,
  getConversationsValidator,
  wrapRequestsHandler(getConversationsControllers)
)

export default conversationsRouter
