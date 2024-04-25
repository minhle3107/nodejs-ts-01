import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
import { wrapRequestsHandler } from '~/utils/handlers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const mediasRoutes = Router()

mediasRoutes.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(uploadImageController)
)

mediasRoutes.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(uploadVideoController)
)

export default mediasRoutes
