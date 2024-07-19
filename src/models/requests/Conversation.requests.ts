import { ParamsDictionary } from 'express-serve-static-core'

export interface IGetConversationParams extends ParamsDictionary {
  receiver_id: string
}
