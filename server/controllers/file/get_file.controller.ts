import fs from 'fs'
import path from 'path'
import { UPLOAD_PATH } from '@/server/constants'
import { Controller, params } from '@/server/helpers/controller'
import { NOT_FOUND } from '@/server/helpers/errors'
import { fileRepository } from '@/server/repository'
import { File } from '@/server/entities'

class Params {
  name: string
  thumbnail: string
}

@params(Params)
export class GetFileController extends Controller<Params> {
  async main() {
    console.log(this.params)

    const file = await fileRepository.findOne({
      query: {
        name: this.params.name,
      },
      meta: this.req.meta,
    })

    if (!file) return this.sendError(NOT_FOUND, { message: 'File NotFound' })

    if (this.params.thumbnail) return this.sendThumbnail(file)
    else return this.sendFile(file)
  }

  sendThumbnail(file: File) {
    // const [w, h] = this.params.thumbnail.
  }

  sendFile(file: File) {
    console.log(path.join(UPLOAD_PATH, file.path))

    return fs.promises
      .readFile(path.join(UPLOAD_PATH, file.path))
      .then((buffer) => {
        this.res.contentType(file.mimetype).end(buffer)
      })
      .catch((error) => {
        console.log(error)
        this.sendError(NOT_FOUND)
      })
  }
}
