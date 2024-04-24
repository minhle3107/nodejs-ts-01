import { existsSync, mkdirSync } from 'node:fs'
import { Request } from 'express'
import { File } from 'formidable'
import { UPLOADS_IMAGES_DIR, UPLOADS_TEMPS_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOADS_TEMPS_DIR, UPLOADS_IMAGES_DIR].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  // Cách fix ESModule trong CommonJS
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOADS_TEMPS_DIR,
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
        return reject(new Error('No image uploaded'))
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  return fullName.slice(0, fullName.lastIndexOf('.'))
}
