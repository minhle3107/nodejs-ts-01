// import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
// import { config } from 'dotenv'

// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses')
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { config } = require('dotenv')

config()
// Create SES service object.
const sesClient = new SESClient({
  // eslint-disable-next-line no-undef
  region: process.env.AWS_REGION,
  credentials: {
    // eslint-disable-next-line no-undef
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // eslint-disable-next-line no-undef
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = async (toAddress, subject, body) => {
  const sendEmailCommand = createSendEmailCommand({
    // eslint-disable-next-line no-undef
    fromAddress: process.env.SES_FROM_ADDRESS,
    toAddresses: toAddress,
    body,
    subject
  })

  try {
    // eslint-disable-next-line no-undef
    console.log('Sending email...')
    return await sesClient.send(sendEmailCommand)
  } catch (e) {
    // eslint-disable-next-line no-undef
    console.error('Failed to send email.')
    return e
  }
}

sendVerifyEmail('tym1402.xm@gmail.com', 'Tiêu đề email', '<h1>Nội dung email gửi từ Minhle 01.07.2024</h1>').then(
  () => {
    // eslint-disable-next-line no-undef
    console.log('Done')
  }
)
