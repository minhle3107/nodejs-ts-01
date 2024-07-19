import express from 'express'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'
import { getConversationsControllers } from '~/controllers/conversations.controllers'

const conversationsRouter = express.Router()

conversationsRouter.get(
  '/receivers/:receiver_id/',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(getConversationsControllers)
)

export default conversationsRouter
