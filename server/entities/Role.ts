import {
  After,
  Entity,
  Field,
  FindOneContext,
  Repository,
  repository,
} from '@nguyenduclong/mongodbts'
import { Schema } from 'mongoose'
import { EntityPermission } from './EntityPermission'

export enum DefaultRole {
  ADMIN = 'Admin',
  WRITER = 'Writer',
  AUTHENTIACATED = 'Authenticated',
  GUEST = 'Guest',
}

@Entity({ timestamps: true })
export class Role {
  id?: any
  _id?: any

  @Field({ type: String, unique: true, required: true })
  name: string

  @Field({ type: Boolean, default: false })
  isDefault: boolean

  permissions: EntityPermission[]
}

@repository(Role)
export class RoleRepository extends Repository<Role> {
  onCreateSchema(schema: Schema<Role>) {
    schema.virtual('permissions', {
      ref: 'EntityPermission',
      foreignField: 'entity',
      localField: '_id',
      justOne: false,
    })
    return schema
  }
}
