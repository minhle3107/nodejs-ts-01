import { Router } from 'express'
import { wrapRequestsHandler } from '~/utils/handlers'
import { serveImagesController } from '~/controllers/medias.controllers'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImagesController)

export default staticRoutes
