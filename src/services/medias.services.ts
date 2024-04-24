import { Request } from 'express'
import { getNameFromFullName, handleUploadImage } from '~/utils/file'
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
        const newPath = path.resolve(UPLOADS_IMAGES_DIR, `${newNameImage}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newNameImage}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newNameImage}.jpg`,
          type: EnumMediaType.Image
        }
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
