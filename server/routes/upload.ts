import { Router, urlencoded } from 'express'
import { UploadSingleController } from '@/server/controllers/upload/upload_single.controller'
import { upload } from '@/server/helpers/multer'
import { createApi } from '@/server/helpers/router'

const router = Router()
router.use(urlencoded({ extended: true }))

const api = createApi(router, '/')

api.post('/', upload.single('file'), UploadSingleController.init())
api.post('/multi', upload.array('files'))

export default {
  path: '/upload',
  router,
}
