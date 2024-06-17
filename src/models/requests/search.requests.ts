import { IPagination } from '~/models/requests/Tweet.requests'

export interface ISearchQuery extends IPagination {
  content: string
}
