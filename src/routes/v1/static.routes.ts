import { Router } from 'express'
import {
  serveImagesController,
  serveM3U8Controller,
  serveSegmentController,
  serveVideoStreamVideoController
} from '~/controllers/medias.controllers'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImagesController)
staticRoutes.get('/video-stream/:name', serveVideoStreamVideoController)
staticRoutes.get('/video-hls/:id/master.m3u8', serveM3U8Controller)
staticRoutes.get('/video-hls/:id/:v/:segment', serveSegmentController)

export default staticRoutes
