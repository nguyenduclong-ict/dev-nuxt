import { FieldOption } from '@/server/helpers/repository'
import {
  Entity,
  Field,
  Index,
  Repository,
  repository,
} from '@nguyenduclong/mongodbts'
import { SchemaTypes } from 'mongoose'

export class FormAttachment {
  name?: string
  url?: string
  size?: number
}

@Entity({ timestamps: true })
@Index<Form>({ title: 'text' })
export class Form {
  id?: any
  _id?: any

  @Field({ type: String })
  @FieldOption({ label: 'Tiêu đề' })
  title: string // tiêu đều

  @Field({ type: String })
  @FieldOption({ type: 'Tinymce', label: 'Nội dung' })
  content: string

  @Field({ type: SchemaTypes.Mixed, default: [] })
  @FieldOption({
    label: 'Đính kèm',
    type: 'GalleryPicker',
    props: { multiple: true, object: true },
  })
  attachments: FormAttachment[]

  createdAt?: Date
  updatedAt?: Date
}

@repository(Form)
export class FormRepository extends Repository<Form> {
  onInited() {}
}
