import { author } from '@/server/helpers/repository'
import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts'
import { SchemaTypes } from 'mongoose'

interface FileThumbnail {
  path?: string
  width?: number
  height?: number
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

  createdAt?: Date
  updatedAt?: Date
}

@repository(File)
@author()
export class FileRepository extends Repository<File> {}
