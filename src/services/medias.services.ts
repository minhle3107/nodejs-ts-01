import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOADS_IMAGES_DIR } from '~/constants/dir'
import path from 'node:path'
import fs from 'fs'
import { config } from 'dotenv'
import { isProduction } from '~/constants/config'
import * as process from 'node:process'
import { EnumMediaType } from '~/constants/enum'
import { IMedia } from '~/models/Other'

config()

class MediasService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: IMedia[] = await Promise.all(
      files.map(async (file) => {
        const newNameImage = getNameFromFullName(file.newFilename)
        const newPath = path.resolve(UPLOADS_IMAGES_DIR, `${newNameImage}.jpeg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newNameImage}.jpeg`
            : `http://localhost:${process.env.PORT}/static/image/${newNameImage}.jpeg`,
          type: EnumMediaType.Image
        }
      })
    )
    return result
  }

  async handleUploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const result: IMedia[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video-stream/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video-stream/${file.newFilename}`,
        type: EnumMediaType.Video
      }
    })

    return result
  }
}

const mediasService = new MediasService()
export default mediasService
