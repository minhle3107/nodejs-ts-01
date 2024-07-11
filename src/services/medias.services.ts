import { Request } from 'express'
import { getFiles, getNameFromFullName, handleUploadImage, handleUploadVideo, handleUploadVideoHLS } from '~/utils/file'
import sharp from 'sharp'
import { UPLOADS_IMAGES_DIR, UPLOADS_VIDEOS_DIR } from '~/constants/dir'
import path from 'node:path'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { envConfig, isProduction } from '~/constants/config'
import { EnumEncodingStatus, EnumMediaType } from '~/constants/enums'
import { IMedia } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from '~/services/database.services'
import VideoStatus from '~/models/shcemas/VideoStatus.schema'
import { uploadFileToS3 } from '~/utils/s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { rimrafSync } from 'rimraf'

class Queue {
  items: string[]
  encoding: boolean

  constructor() {
    this.items = []
    this.encoding = false
  }

  async enqueue(item: string) {
    this.items.push(item)
    // item = /Users/hoangpham/Downloads/IMG_0001.MOV
    const idName = getNameFromFullName(item.split('/').pop() as string)
    console.log(idName)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EnumEncodingStatus.Pending
      })
    )
    this.processEncode()
  }

  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameFromFullName(videoPath.split('/').pop() as string)
      await databaseService.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EnumEncodingStatus.Processing
          },
          $currentDate: { updated_at: true }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        const mime = (await import('mime')).default
        this.items.shift()
        await fsPromises.unlink(videoPath)

        const files = getFiles(path.resolve(UPLOADS_VIDEOS_DIR, idName))
        await Promise.all(
          files.map((filepath) => {
            const filename = 'videos-hls' + filepath.replace(path.resolve(UPLOADS_VIDEOS_DIR), '')
            const contentType = mime.getType(filepath) || 'video/*'
            return uploadFileToS3({
              fileName: filename,
              filePath: filepath,
              contentType: contentType
            })
          })
        )
        rimrafSync(path.resolve(UPLOADS_VIDEOS_DIR, idName))
        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EnumEncodingStatus.Completed
            },
            $currentDate: { updated_at: true }
          }
        )
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: {
                status: EnumEncodingStatus.Failed
              },
              $currentDate: { updated_at: true }
            }
          )
          .catch((e) => {
            console.error('Update status failed', e)
          })
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
            ? `${envConfig.host}/api/v1/static/image/${newNameImage}.jpeg`
            : `http://localhost:${envConfig.port}/api/v1/static/image/${newNameImage}.jpeg`,
          type: EnumMediaType.Image
        }
      })
    )
    return result
  }

  async handleUploadImageToS3(req: Request) {
    const mime = (await import('mime')).default
    const files = await handleUploadImage(req)
    const result: IMedia[] = await Promise.all(
      files.map(async (file) => {
        const newNameImage = getNameFromFullName(file.newFilename)
        const newFileFullName = `${newNameImage}.jpeg`
        const newPath = path.resolve(UPLOADS_IMAGES_DIR, newFileFullName)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          fileName: `images/${newFileFullName}`,
          filePath: newPath,
          contentType: 'image/jpeg'
        })

        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])
        // return {
        //   url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
        //   type: EnumMediaType.Image
        // }
        return {
          url: isProduction
            ? `${envConfig.host}/api/v1/static/image/${newNameImage}.jpeg`
            : `http://localhost:${envConfig.port}/api/v1/static/image/${newNameImage}.jpeg`,
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
          ? `${envConfig.host}/api/v1/static/video-stream/${file.newFilename}`
          : `http://localhost:${envConfig.port}/api/v1/static/video-stream/${file.newFilename}`,
        type: EnumMediaType.Video
      }
    })

    return result
  }

  async handleUploadVideoToS3(req: Request) {
    const files = await handleUploadVideo(req)
    const result: IMedia[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          fileName: `videos/${file.newFilename}`,
          filePath: file.filepath,
          contentType: 'video/mp4'
        })
        // await fsPromises.unlink(file.filepath)
        const dirPath = path.dirname(file.filepath) // Get the directory path
        await fsPromises.rm(dirPath, { recursive: true })
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: EnumMediaType.Video
        }
        // return {
        //   url: isProduction
        //     ? `${envConfig.host}/api/v1/static/video-stream/${file.newFilename}`
        //     : `http://localhost:${envConfig.port}/api/v1/static/video-stream/${file.newFilename}`,
        //   type: EnumMediaType.Video
        // }
      })
    )

    return result
  }

  async handleUploadVideoHLS(req: Request) {
    const files = await handleUploadVideoHLS(req)
    const result: IMedia[] = await Promise.all(
      files.map(async (file) => {
        const folderVideo = getNameFromFullName(file.newFilename)
        await queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${envConfig.host}/api/v1/static/video-hls/${folderVideo}/master.m3u8`
            : `http://localhost:${envConfig.port}/api/v1/static/video-hls/${folderVideo}/master.m3u8`,
          type: EnumMediaType.HLS
        }
      })
    )

    return result
  }

  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    if (!data) {
      return {
        status: EnumEncodingStatus.NotFound
      }
    }

    return data
  }
}

const mediasService = new MediasService()
export default mediasService
