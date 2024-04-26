import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'
import USERS_MESSAGES from '~/constants/messages'
import { UPLOADS_IMAGES_DIR, UPLOADS_VIDEOS_DIR, UPLOADS_VIDEOS_TEMPS_DIR } from '~/constants/dir'
import path from 'node:path'
import httpStatus from '~/constants/httpStatus'
import fs from 'fs'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const urlImage = await mediasService.handleUploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: urlImage
  })
}

export const serveImagesController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOADS_IMAGES_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status || httpStatus.NOT_FOUND).send(USERS_MESSAGES.IMAGE_NOT_FOUND)
    }
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const urlVideo = await mediasService.handleUploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
    result: urlVideo
  })
}

export const serveVideoStreamVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(httpStatus.BAD_REQUEST).send(USERS_MESSAGES.INVALID_RANGE)
  }
  const { name } = req.params
  const pathVideo = path.resolve(UPLOADS_VIDEOS_DIR, name)
  const videoSize = fs.statSync(pathVideo).size
  const CHUNK_SIZE = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize)
  const contentLength = end - start

  const mime = (await import('mime')).default
  const contentType = mime.getType(pathVideo) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(httpStatus.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(pathVideo, { start, end })
  videoStream.pipe(res)
}
