import fs from 'node:fs'
import path from 'node:path'

export const initFolder = async () => {
  const uploadsFolderPath = path.resolve('uploads')
  if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath, {
      recursive: true // Tạo folder nếu chưa tồn tại
    })
  }
}
