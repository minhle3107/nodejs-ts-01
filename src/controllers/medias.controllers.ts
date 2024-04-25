import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'
import USERS_MESSAGES from '~/constants/messages'
import { UPLOADS_IMAGES_DIR, UPLOADS_VIDEOS_DIR, UPLOADS_VIDEOS_TEMPS_DIR } from '~/constants/dir'
import path from 'node:path'
import httpStatus from '~/constants/httpStatus'

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
  const urlImage = await mediasService.handleUploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: urlImage
  })
}

export const serveVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOADS_VIDEOS_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status || httpStatus.NOT_FOUND).send(USERS_MESSAGES.VIDEO_NOT_FOUND)
    }
  })
}
