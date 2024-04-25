import { Router } from 'express'
import { serveImagesController, serveVideoController } from '~/controllers/medias.controllers'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImagesController)
staticRoutes.get('/video/:name', serveVideoController)

export default staticRoutes
