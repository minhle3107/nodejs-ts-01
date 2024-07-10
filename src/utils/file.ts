import { existsSync, mkdirSync } from 'node:fs'
import { Request } from 'express'
import { File } from 'formidable'
import { LOGS_DIR, UPLOADS_IMAGES_TEMPS_DIR, UPLOADS_VIDEOS_DIR, UPLOADS_VIDEOS_TEMPS_DIR } from '~/constants/dir'
import fs from 'fs'
import USERS_MESSAGES from '~/constants/messages'
import path from 'node:path'

export const initFolder = () => {
  ;[LOGS_DIR, UPLOADS_IMAGES_TEMPS_DIR, UPLOADS_VIDEOS_TEMPS_DIR].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  // Cách fix ESModule trong CommonJS
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOADS_IMAGES_TEMPS_DIR,
    maxFiles: 6,
    keepExtensions: true,
    maxFileSize: 5000 * 1024, // 500KB
    maxTotalFileSize: 5000 * 1024 * 6, // 500KB * 6
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      // keep only images
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error(USERS_MESSAGES.NO_IMAGE_UPLOADED))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  // Cách fix ESModule trong CommonJS
  const formidable = (await import('formidable')).default
  const nanoid = (await import('nanoid')).nanoid
  const idName = nanoid()
  const folderPath = path.resolve(UPLOADS_VIDEOS_DIR, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error(USERS_MESSAGES.VIDEO_MUST_MP4_OR_MOV) as any)
      }
      return valid
    },
    filename: () => {
      return idName
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error(USERS_MESSAGES.NO_VIDEO_UPLOADED))
      }

      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtensionFromFullName(video.originalFilename as string)
        fs.renameSync(video.filepath, `${video.filepath}${ext}`)
        video.newFilename = `${video.newFilename}${ext}`
        video.filepath = `${video.filepath}${ext}`
      })
      resolve(files.video as File[])
    })
  })
}

export const handleUploadVideoHLS = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const nanoid = (await import('nanoid')).nanoid
  const idName = nanoid()
  const folderPath = path.resolve(UPLOADS_VIDEOS_DIR, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error(USERS_MESSAGES.VIDEO_MUST_MP4_OR_MOV) as any)
      }
      return valid
    },
    filename: () => {
      return idName
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error(USERS_MESSAGES.NO_VIDEO_UPLOADED))
      }

      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtensionFromFullName(video.originalFilename as string)
        fs.renameSync(video.filepath, `${video.filepath}${ext}`)
        video.newFilename = `${video.newFilename}${ext}`
        video.filepath = `${video.filepath}${ext}`
      })
      resolve(files.video as File[])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  return fullName.slice(0, fullName.lastIndexOf('.'))
}

export const getExtensionFromFullName = (fullName: string) => {
  return fullName.slice(fullName.lastIndexOf('.'))
}

export const getFiles = (dir: string, files: string[] = []) => {
  const fileList = fs.readdirSync(dir)

  for (const file of fileList) {
    const name = `${dir}/${file}`

    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files)
    } else {
      files.push(name)
    }
  }
  return files
}
