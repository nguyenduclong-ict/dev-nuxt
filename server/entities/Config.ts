import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts'
import { SchemaTypes } from 'mongoose'

@Entity({ timestamps: true })
export class Config {
  id?: any
  _id?: any

  @Field({ type: String, unique: true })
  key: string

  @Field({ type: SchemaTypes.Mixed })
  value: any

  createdAt?: Date
  updatedAt?: Date
}

@repository(Config)
export class ConfigRepository extends Repository<Config> {}
