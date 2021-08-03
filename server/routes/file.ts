import { GetFileController } from '@/server/controllers/file/get_file.controller'
import { createApi, MergeParams } from '@/server/helpers/router'
import { Router } from 'express'

const router = Router()
const api = createApi(router, '/file')

api.get('/:name', MergeParams(), GetFileController.init())

export default {
  path: '/file',
  router,
}
