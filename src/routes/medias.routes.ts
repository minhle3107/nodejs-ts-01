import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'

const mediasRoutes = Router()

mediasRoutes.post('/upload-image', uploadSingleImageController)

export default mediasRoutes
