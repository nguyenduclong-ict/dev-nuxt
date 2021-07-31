import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts'
import { SchemaTypes } from 'mongoose'

@Entity({ timestamps: true })
export class Token {
  id?: any
  _id?: any

  @Field({ type: String, enum: ['refresh_token', 'reset_password'] })
  type: 'refresh_token' | 'reset_password'

  @Field({ type: String, required: true })
  value: string

  @Field({ type: SchemaTypes.Mixed })
  meta?: string

  @Field({ type: Date })
  expiresAt: Date

  createdAt?: Date
  updatedAt?: Date
}

@repository(Token)
export class TokenRepository extends Repository<Token> {
  authorKey
}
