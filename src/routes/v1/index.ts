import express from 'express'
import usersRoutes from '~/routes/v1/users.routes'
import mediasRoutes from '~/routes/v1/medias.routes'
import staticRoutes from '~/routes/v1/static.routes'
import tweetsRoutes from '~/routes/v1/tweets.routes'
import bookmarksRoutes from '~/routes/v1/bookmarks.routes'
import likesRoutes from '~/routes/v1/likes.routes'
import searchRoutes from '~/routes/v1/search.routes'
import { UPLOADS_VIDEOS_DIR } from '~/constants/dir'
import { apiLimiter } from '~/constants/config'
import conversationsRouter from '~/routes/v1/conversations.routes'

const v1Routes = express.Router()

v1Routes.use('/users', apiLimiter, usersRoutes)
v1Routes.use('/medias', mediasRoutes)
v1Routes.use('/static', staticRoutes)
v1Routes.use('/tweets', tweetsRoutes)
v1Routes.use('/bookmarks', bookmarksRoutes)
v1Routes.use('/likes', likesRoutes)
v1Routes.use('/search', searchRoutes)
v1Routes.use('/conversations', conversationsRouter)
v1Routes.use('/static/video', express.static(UPLOADS_VIDEOS_DIR))

export default v1Routes
