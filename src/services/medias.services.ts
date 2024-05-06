import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo, handleUploadVideoHLS } from '~/utils/file'
import sharp from 'sharp'
import { UPLOADS_IMAGES_DIR } from '~/constants/dir'
import path from 'node:path'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { config } from 'dotenv'
import { isProduction } from '~/constants/config'
import * as process from 'node:process'
import { EnumMediaType } from '~/constants/enum'
import { IMedia } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'

config()

class Queue {
  items: string[]
  encoding: boolean

  constructor() {
    this.items = []
    this.encoding = false
  }

  enqueue(item: string) {
    this.items.push(item)
    this.processEncode()
  }

  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromises.unlink(videoPath)
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        console.error(`Encode video ${videoPath} failed`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('All video encoded')
    }
  }
}

const queue = new Queue()

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

  async handleUploadVideoHLS(req: Request) {
    const files = await handleUploadVideoHLS(req)
    const result: IMedia[] = await Promise.all(
      files.map(async (file) => {
        const folderVideo = getNameFromFullName(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${folderVideo}/master.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${folderVideo}/master.m3u8`,
          type: EnumMediaType.HLS
        }
      })
    )

    return result
  }
}

const mediasService = new MediasService()
export default mediasService
