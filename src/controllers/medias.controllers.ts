import { Request, Response } from 'express'
import mediasService from '~/services/medias.services'
import USERS_MESSAGES from '~/constants/messages'
import { UPLOADS_IMAGES_DIR, UPLOADS_VIDEOS_DIR } from '~/constants/dir'
import path from 'node:path'
import httpStatus from '~/constants/httpStatus'
import fs from 'fs'
import { getNameFromFullName } from '~/utils/file'
import { sendFileFromS3 } from '~/utils/s3'

export const uploadImageController = async (req: Request, res: Response) => {
  const urlImage = await mediasService.handleUploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: urlImage
  })
}

export const uploadImageToS3Controller = async (req: Request, res: Response) => {
  const urlImage = await mediasService.handleUploadImageToS3(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: urlImage
  })
}

export const serveImagesController = async (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOADS_IMAGES_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status || httpStatus.NOT_FOUND).send(USERS_MESSAGES.IMAGE_NOT_FOUND)
    }
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const urlVideo = await mediasService.handleUploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
    result: urlVideo
  })
}
export const uploadVideoToS3Controller = async (req: Request, res: Response) => {
  const urlVideo = await mediasService.handleUploadVideoToS3(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
    result: urlVideo
  })
}

export const uploadVideoHLSController = async (req: Request, res: Response) => {
  const urlVideo = await mediasService.handleUploadVideoHLS(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
    result: urlVideo
  })
}

export const videoStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await mediasService.getVideoStatus(id as string)
  return res.json({
    message: USERS_MESSAGES.GET_VIDEO_STATUS_SUCCESSFULLY,
    result: result
  })
}

export const serveVideoStreamVideoController = async (req: Request, res: Response) => {
  const range = req.headers.range
  if (!range) {
    return res.status(httpStatus.BAD_REQUEST).send(USERS_MESSAGES.INVALID_RANGE)
  }
  const { name } = req.params
  const folderVideo = getNameFromFullName(name)
  const pathVideo = path.resolve(`${UPLOADS_VIDEOS_DIR}/${folderVideo}`, name)

  const videoSize = fs.statSync(pathVideo).size
  const CHUNK_SIZE = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  const contentLength = end - start + 1

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

// export const serveM3U8Controller = async (req: Request, res: Response) => {
//   const { id } = req.params
//   return res.sendFile(path.resolve(UPLOADS_VIDEOS_DIR, id, 'master.m3u8'), (err) => {
//     if (err) {
//       res.status((err as any).status || httpStatus.NOT_FOUND).send(USERS_MESSAGES.VIDEO_NOT_FOUND)
//     }
//   })
// }
//
// export const serveSegmentController = async (req: Request, res: Response) => {
//   const { id, v, segment } = req.params
//   return res.sendFile(path.resolve(UPLOADS_VIDEOS_DIR, id, v, segment), (err) => {
//     if (err) {
//       res.status((err as any).status || httpStatus.NOT_FOUND).send(USERS_MESSAGES.VIDEO_NOT_FOUND)
//     }
//   })
// }

export const serveM3U8Controller = async (req: Request, res: Response) => {
  const { id } = req.params
  await sendFileFromS3(res, `videos-hls/${id}/master.m3u8`)
}

export const serveSegmentController = async (req: Request, res: Response) => {
  const { id, v, segment } = req.params
  await sendFileFromS3(res, `videos-hls/${id}/${v}/${segment}`)
}
