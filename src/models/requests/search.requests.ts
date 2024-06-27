import { IPagination } from '~/models/requests/Tweet.requests'
import { EnumMediaTypeQuery } from '~/constants/enums'

export interface ISearchQuery extends IPagination {
  content: string
  media_type: EnumMediaTypeQuery
}
