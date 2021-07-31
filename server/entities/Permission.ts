import {
  PermissionAction,
  PermissionMethod,
  PermissionType,
} from '@/server/constants/permission.enum'
import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts'
import { SchemaTypes } from 'mongoose'

@Entity({ timestamps: true })
export class Permission {
  id?: any
  _id?: any

  @Field({
    type: String,
    enum: Object.values(PermissionType),
    required: [true, 'Missing type for permission'],
  })
  type: PermissionType

  @Field({ type: Boolean, default: false })
  isDefault?: boolean

  @Field({ type: String })
  name?: string

  @Field({ type: String })
  description?: string

  @Field({
    type: SchemaTypes.Mixed,
    validate: {
      validator: (v: any) =>
        v.endpoint && Object.values(PermissionMethod).includes(v.method),
      message: 'Missing parameter for api permission',
    },
  })
  api?: {
    endpoint: string
    method: PermissionMethod
  }

  // setting for entity
  @Field({
    type: SchemaTypes.Mixed,
    validate: {
      validator: (v: any) =>
        v.name && Object.values(PermissionAction).includes(v.action),
      message: 'Missing parameter for entity permission',
    },
  })
  entity?: {
    name: string
    action: PermissionAction
  }

  createdAt?: Date
  updatedAt?: Date

  // setting for page
  @Field({ type: String })
  page?: string
}

@repository(Permission)
export class PermissionRepository extends Repository<Permission> {}
