import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { Request } from 'express'
import path from 'node:path'

export const initFolder = () => {
  const uploadsFolderPath = resolve('uploads')
  if (!existsSync(uploadsFolderPath)) {
    mkdirSync(uploadsFolderPath, { recursive: true })
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  // Cách fix ESModule trong CommonJS
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 500 * 1024, // 500KB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      // keep only images
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No image uploaded'))
      }
      resolve(files)
    })
  })
}
