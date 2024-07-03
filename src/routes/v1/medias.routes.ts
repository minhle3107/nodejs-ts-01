import express from 'express'
import {
  uploadImageController,
  uploadImageToS3Controller,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/medias.controllers'
import { wrapRequestsHandler } from '~/utils/handlers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const mediasRoutes = express.Router()

mediasRoutes.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(uploadImageController)
)
mediasRoutes.post(
  '/upload-image-to-s3',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestsHandler(uploadImageToS3Controller)
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
