import { Router } from 'express'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestsHandler } from '~/utils/handlers'
import { likeControllers, unLikeControllers } from '~/controllers/likes.controllers'

const likesRoutes = Router()

likesRoutes.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestsHandler(likeControllers))

likesRoutes.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(unLikeControllers)
)

export default likesRoutes
