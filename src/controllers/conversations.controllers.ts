import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import conversationService from '~/services/conversations.services'
import { CONVERSATIONS_MESSAGES } from '~/constants/messages'

export const getConversationsControllers = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const { receiver_id } = req.params
  console.log(sender_id, receiver_id)

  const result = await conversationService.getConversations({ limit, page, sender_id, receiver_id })
  return res.json({
    message: CONVERSATIONS_MESSAGES.GET_CONVERSATIONS_SUCCESS,
    result: {
      limit,
      page,
      total_page: Math.ceil(result.total / limit),
      conversations: result.conversations
    }
  })
}
