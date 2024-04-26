import { Router } from 'express'
import { serveImagesController, serveVideoStreamVideoController } from '~/controllers/medias.controllers'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImagesController)
staticRoutes.get('/video-stream/:name', serveVideoStreamVideoController)

export default staticRoutes
