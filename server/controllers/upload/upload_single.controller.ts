import { UPLOAD_PATH } from '@/server/constants'
import { Controller, params } from '@/server/helpers/controller'
import { fileRepository } from '@/server/repository'

class Params {}

@params(Params)
export class UploadSingleController extends Controller<Params> {
  async main() {
    const file = await fileRepository.create({
      data: {
        name: this.req.file.filename,
        path: this.req.file.path.replace(new RegExp('^' + UPLOAD_PATH), ''),
        public: true,
        mimetype: this.req.file.mimetype,
        thumbnails: [],
      },
      meta: this.req.meta,
    })

    this.res.json(file)
  }
}
