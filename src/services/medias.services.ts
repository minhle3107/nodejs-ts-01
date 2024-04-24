import { Request } from 'express'
import { getNameFromFullName, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOADS_IMAGES_DIR } from '~/constants/dir'
import path from 'node:path'
import fs from 'fs'

class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newNameImage = getNameFromFullName(file.newFilename)
    const newPath = path.resolve(UPLOADS_IMAGES_DIR, `${newNameImage}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)
    fs.unlinkSync(file.filepath)
    return `http://localhost:4000/uploads/images/${newNameImage}.jpg`
  }
}

const mediasService = new MediasService()
export default mediasService
