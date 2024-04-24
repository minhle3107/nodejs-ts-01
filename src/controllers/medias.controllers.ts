import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'
import USERS_MESSAGES from '~/constants/messages'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const urlImage = await mediasService.handleUploadSingleImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: urlImage
  })
}
