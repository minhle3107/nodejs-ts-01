import { ObjectId } from 'mongodb'

interface IConversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
}

export default class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date

  constructor({ _id, sender_id, receiver_id, content, created_at, updated_at }: IConversation) {
    const date = new Date()
    this.sender_id = sender_id
    this.receiver_id = receiver_id
    this.content = content
    this.sender_id = sender_id
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
