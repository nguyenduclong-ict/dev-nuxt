import fs from 'fs'
import path, { join } from 'path'
import { UPLOAD_PATH } from '@/server/constants'
import { Controller, params } from '@/server/helpers/controller'
import { NOT_FOUND } from '@/server/helpers/errors'
import { fileRepository } from '@/server/repository'
import { File } from '@/server/entities'
import sharp from 'sharp'

class Params {
  name: string
  thumbnail: string
}

@params(Params)
export class GetFileController extends Controller<Params> {
  async main() {
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
    let [w, h] = this.params.thumbnail?.split('x') as any[]
    if (!w) {
      return this.sendFileWithPath(file.path, file.mimetype)
    }

    w = +w
    h = +h || null

    const thumb = file.thumbnails.find((e) => e.width === w && e.height === h)

    if (thumb) {
      this.sendFileWithPath(thumb.path, file.mimetype)
    } else {
      const fileExt = path.extname(file.name)
      const filename = path.basename(file.name, fileExt)
      const thumbName = filename + `_${w}x${h}${fileExt}`
      const thumbPath = path.resolve(UPLOAD_PATH, 'thumbnails', thumbName)

      sharp(path.join(UPLOAD_PATH, file.path))
        .resize(w, h, { fit: 'cover' })
        .toFile(thumbPath)
        .then((data) => {
          return fileRepository.updateOne({
            query: {
              id: file.id,
            },
            data: {
              $push: {
                thumbnails: {
                  width: w,
                  height: h,
                  path: join('thumbnails', thumbName),
                  name: thumbName,
                  size: data.size,
                },
              },
            },
          })
        })
        .then(() =>
          this.sendFileWithPath(
            path.join('thumbnails', thumbName),
            file.mimetype
          )
        )
    }
  }

  sendFile(file: File) {
    return this.sendFileWithPath(file.path, file.mimetype)
  }

  sendFileWithPath(filePath: string, mimetype: string) {
    return fs.promises
      .readFile(path.join(UPLOAD_PATH, filePath))
      .then((buffer) => {
        this.res.contentType(mimetype).end(buffer)
      })
      .catch((error) => {
        console.log(error)
        this.sendError(NOT_FOUND)
      })
  }
}
