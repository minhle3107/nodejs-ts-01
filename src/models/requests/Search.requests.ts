import { IPagination } from '~/models/requests/Tweet.requests'
import { EnumMediaTypeQuery, EnumPeopleFollow } from '~/constants/enums'
import { Query } from 'express-serve-static-core'

export interface ISearchQuery extends IPagination, Query {
  content: string
  media_type?: EnumMediaTypeQuery
  people_follow?: EnumPeopleFollow
}
