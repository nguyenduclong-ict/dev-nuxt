import {
  Before,
  Entity,
  Field,
  Index,
  Repository,
  repository,
} from '@nguyenduclong/mongodbts'

@Entity({ timestamps: true })
@Index<New>({ text: 'text' })
export class New {
  id?: any
  _id?: any

  @Field({ type: String })
  sourceId: string

  @Field({ type: String })
  url: string

  @Field({ type: String })
  text: string

  @Field({ type: Date })
  time: string | Date

  createdAt?: Date
  updatedAt?: Date
}

@repository(New)
export class NewRepository extends Repository<New> {}
