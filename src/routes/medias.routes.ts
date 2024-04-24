import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { wrapRequestsHandler } from '~/utils/handlers'

const mediasRoutes = Router()

mediasRoutes.post('/upload-image', wrapRequestsHandler(uploadImageController))

export default mediasRoutes
