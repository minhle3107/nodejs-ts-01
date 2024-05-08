import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/medias.controllers'
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

mediasRoutes.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(uploadVideoHLSController)
)

mediasRoutes.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(videoStatusController)
)

export default mediasRoutes
