import { Router } from 'express'
import { serveImagesController } from '~/controllers/medias.controllers'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImagesController)

export default staticRoutes
