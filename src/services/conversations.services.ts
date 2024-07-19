import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class ConversationService {
  async getConversations({
    limit,
    page,
    sender_id,
    receiver_id
  }: {
    limit: number
    page: number
    sender_id: string
    receiver_id: string
  }) {
    const match = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }

    // const [conversations, total] = await Promise.all([])

    const [conversations, total] = await Promise.all([
      databaseService.conversations
        .find(match)
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray(),
      databaseService.conversations.countDocuments(match)
    ])

    return {
      conversations,
      total
    }
  }
}

const conversationService = new ConversationService()
export default conversationService
