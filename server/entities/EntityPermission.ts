import {
  Entity,
  Field,
  Index,
  Repository,
  repository,
} from '@nguyenduclong/mongodbts'
import { Schema, SchemaTypes } from 'mongoose'
import { Permission } from './Permission'

@Entity({ timestamps: true, autoIndex: true })
@Index<EntityPermission>({ entityName: 1, permission: 1, entity: 1 })
export class EntityPermission {
  id?: any
  _id?: any

  @Field({ type: String })
  entityName: string

  @Field({ type: SchemaTypes.ObjectId, refPath: 'entityName' })
  entity?: any

  @Field({ type: SchemaTypes.ObjectId, ref: 'Permission' })
  permission: Permission

  @Field({ type: Boolean })
  isCreator?: boolean

  @Field({ type: Boolean })
  isSameRole?: boolean

  createdAt?: Date
  updatedAt?: Date
}

export interface EntityPermissionOptions {
  isCreator?: boolean
  isSameRole?: boolean
}

@repository(EntityPermission)
export class EntityPermissionRepository extends Repository<EntityPermission> {}
