import { NextFunction, Request, Response } from 'express'
import * as path from 'node:path'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  // Cách fix ESModule trong CommonJS
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 600 * 1024
  })
  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err
    }
    res.json({ message: 'Upload image successfully' })
  })
}
