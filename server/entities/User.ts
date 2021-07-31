import {
  Before,
  Context,
  Entity,
  Field,
  Index,
  Repository,
  repository,
} from '@nguyenduclong/mongodbts'
import { Schema, SchemaTypes } from 'mongoose'
import { EntityPermission } from './EntityPermission'
import { Role } from './Role'

@Entity({ timestamps: true, description: 'Tài khoản người dùng' })
@Index<User>({ username: 1 })
export class User {
  id?: any
  _id?: any

  @Field({ type: String, minlength: 4, unique: true, required: true })
  username: string

  @Field({ type: String, minlength: 6 })
  password: string

  @Field({ type: String })
  email?: string

  @Field({ type: Boolean, default: false })
  isAdmin: boolean

  @Field({ type: Boolean, default: false })
  blocked: boolean

  @Field({ type: SchemaTypes.Mixed, default: {} })
  profile: {
    avatar?: string
    name?: string
  }

  @Field([{ type: SchemaTypes.ObjectId, ref: 'Role' }])
  roles: Role[]

  permissions?: EntityPermission[]

  createdAt?: Date
  updatedAt?: Date
}

@repository(User)
export class UserRepository extends Repository<User> {
  onCreateSchema(schema: Schema<User>) {
    schema.virtual('permissions', {
      ref: 'EntityPermission',
      foreignField: 'entity',
      localField: '_id',
      justOne: false,
    })
    return schema
  }
}
