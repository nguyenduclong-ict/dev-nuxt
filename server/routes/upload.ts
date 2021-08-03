import { Router, urlencoded } from 'express'
import { UploadSingleController } from '@/server/controllers/upload/upload_single.controller'
import { upload } from '@/server/helpers/multer'
import { createApi } from '@/server/helpers/router'
import { GetUserInfo } from '../middlewares/auth'

const router = Router()
router.use(urlencoded({ extended: true }))

const api = createApi(router, '/')

api.post('/', GetUserInfo, upload.single('file'), UploadSingleController.init())
api.post('/multi', GetUserInfo, upload.array('files'))

export default {
  path: '/upload',
  router,
}
