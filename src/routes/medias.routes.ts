import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
import { wrapRequestsHandler } from '~/utils/handlers'

const mediasRoutes = Router()

mediasRoutes.post('/upload-image', wrapRequestsHandler(uploadSingleImageController))

export default mediasRoutes
