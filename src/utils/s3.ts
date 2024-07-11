import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import HTTP_STATUS from '~/constants/httpStatus'
import { Response } from 'express'
import { envConfig } from '~/constants/config'
import httpStatus from '~/constants/httpStatus'

const s3 = new S3({
  region: envConfig.awsRegion,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey,
    accessKeyId: envConfig.awsAccessKeyId
  }
})

export const uploadFileToS3 = async ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const fileStream = fs.createReadStream(filePath)
  const uploadParams = {
    Bucket: envConfig.awsBucketName,
    Key: fileName,
    Body: fileStream,
    ContentType: contentType // Sử dụng contentType được truyền vào
  }

  try {
    const parallelUploads3 = new Upload({
      client: s3,
      params: uploadParams,
      queueSize: 4, // Ví dụ: số lượng tải lên song song
      partSize: 1024 * 1024 * 5, // Ví dụ: kích thước mỗi phần là 5MB
      leavePartsOnError: false // Khi có lỗi, không giữ lại phần đã tải lên
    })

    return await parallelUploads3.done()
  } catch (error) {
    console.error('Upload to S3 failed:', error)
    throw error
  }
}

// export const sendFileFromS3 = async (res: Response, filepath: string) => {
//   try {
//     const data = await s3.getObject({
//       Bucket: envConfig.awsBucketName,
//       Key: filepath
//     })
//     ;(data.Body as any).pipe(res)
//   } catch (error) {
//     res.status(HTTP_STATUS.NOT_FOUND).send('Not found')
//   }
// }

export const sendFileFromS3 = async (res: Response, filepath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: envConfig.awsBucketName,
      Key: filepath
    })

    // Ensure the ContentType from S3 response is used as the Content-Type header in the response
    if (data.ContentType) {
      res.setHeader('Content-Type', data.ContentType)
    }

    // Pipe the S3 object data directly to the response
    ;(data.Body as any).pipe(res)
  } catch (error) {
    console.error('Error fetching file from S3:', error)
    res.status(HTTP_STATUS.NOT_FOUND).send('Not found')
  }
}

// export const sendFileFromS3 = async (res: Response, filepath: string, range?: string) => {
//   try {
//     const params = {
//       Bucket: envConfig.awsBucketName,
//       Key: filepath,
//       Range: range // Thêm Range vào request nếu có
//     }
//
//     const data = await s3.getObject(params)
//
//     if (data.ContentType) {
//       res.setHeader('Content-Type', data.ContentType)
//     }
//
//     // Nếu có range, cần xử lý các header phản hồi phù hợp với range request
//     if (range && data.ContentRange) {
//       res.status(httpStatus.PARTIAL_CONTENT) // Partial Content
//       res.setHeader('Content-Range', data.ContentRange)
//       res.setHeader('Accept-Ranges', 'bytes')
//     }
//
//     // Pipe the S3 object data directly to the response
//     ;(data.Body as any).pipe(res)
//   } catch (error) {
//     console.error('Error fetching file from S3:', error)
//     res.status(HTTP_STATUS.NOT_FOUND).send('Not found')
//   }
// }

/**
 * Streams a file from S3 to the client, supporting both video (with partial content requests) and image content types.
 * @param {Response} res - The Express response object.
 * @param {string} filepath - The path of the file in the S3 bucket.
 * @param {string} [range] - The range header from the client request, if present, mainly for video content.
 */
// export async function sendFileFromS3(res: Response, filepath: string, range?: string) {
//   const Bucket = envConfig.awsBucketName
//   const Key = filepath
//
//   try {
//     const { ContentLength, ContentType } = await s3.headObject({ Bucket, Key })
//     if (!ContentLength) {
//       return res.status(httpStatus.NOT_FOUND).send('File not found')
//     }
//
//     const headers: {
//       'Content-Type': string
//       'Content-Length': number
//       'Content-Range'?: string
//       'Accept-Ranges'?: string
//     } = {
//       'Content-Type': ContentType || 'application/octet-stream',
//       'Content-Length': ContentLength
//     }
//
//     if (range && ContentType?.startsWith('video/')) {
//       const videoSize = ContentLength
//       const CHUNK_SIZE = 10 ** 6 // 1MB for video chunks
//       const start = Number(range.replace(/\D/g, ''))
//       const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
//       const contentLength = end - start + 1
//
//       headers['Content-Range'] = `bytes ${start}-${end}/${videoSize}`
//       headers['Accept-Ranges'] = 'bytes'
//       headers['Content-Length'] = contentLength
//
//       res.writeHead(httpStatus.PARTIAL_CONTENT, headers)
//
//       const { Body } = await s3.getObject({ Bucket, Key, Range: `bytes=${start}-${end}` })
//       ;(Body as any).pipe(res)
//     } else {
//       res.writeHead(httpStatus.OK, headers)
//
//       const { Body } = await s3.getObject({ Bucket, Key })
//       ;(Body as any).pipe(res)
//     }
//   } catch (error) {
//     console.error('Error streaming file from S3:', error)
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error streaming file')
//   }
// }
