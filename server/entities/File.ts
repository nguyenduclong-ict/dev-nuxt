import fs from 'fs'
import { join } from 'path'
import { author } from '@/server/helpers/repository'
import {
  After,
  Before,
  DeleteContext,
  Entity,
  Field,
  Repository,
  repository,
} from '@nguyenduclong/mongodbts'

import { SchemaTypes } from 'mongoose'
import { UPLOAD_PATH } from '../constants'
import { User } from './User'
interface FileThumbnail {
  path?: string
  width?: number
  height?: number
  size?: number
}

@Entity({ timestamps: true })
export class File {
  id?: any
  _id?: any

  @Field({ type: String })
  name: string

  @Field({ type: String, required: true })
  path: string

  @Field({ type: String })
  mimetype: string

  @Field({ type: Boolean })
  public: boolean

  @Field({ type: SchemaTypes.Mixed, default: [] })
  thumbnails: FileThumbnail[]

  @Field({ type: Number, default: 0 })
  size: number

  @Field({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy?: User

  @Field({ type: SchemaTypes.ObjectId, ref: 'User' })
  updatedBy?: User

  createdAt?: Date
  updatedAt?: Date
}

@repository(File)
@author()
export class FileRepository extends Repository<File> {
  @Before('delete')
  async beforeDelete(ctx: DeleteContext<File>) {
    ctx.meta.deleted = await this.find({ query: ctx.query })
  }

  @Before('deleteOne')
  async beforeDeleteOne(ctx: DeleteContext<File>) {
    ctx.meta.deleted = [await this.findOne({ query: ctx.query })]
  }

  @After('delete', 'deleteOne')
  async afterDelete2(ctx: DeleteContext<File>, rs: any) {
    await Promise.all(
      (ctx.meta.deleted as File[]).map((item) => {
        return Promise.all([
          fs.promises.unlink(join(UPLOAD_PATH, item.path)).catch((e) => {
            console.error(e)
          }),
          ...item.thumbnails?.map((thumb) =>
            fs.promises
              .unlink(join(UPLOAD_PATH, 'thumbnails', thumb.path))
              .catch((e) => {
                console.error(e)
              })
          ),
        ])
      })
    )

    return rs
  }
}
