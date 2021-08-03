import { ENTITY_META, FIELD_OPTIONS } from './constants'

export interface EntityMeta {}

export interface FieldOptions {
  type?: 'json' | 'Tinymce' | 'FilePicker' | 'ImagePicker' | 'GalleryPicker'
  label?: string
  props?: AnyObject
}

export function Meta(meta: EntityMeta) {
  return function (constructor: any) {
    Reflect.defineMetadata(ENTITY_META, constructor, meta)
  }
}

export function FieldOption(options: FieldOptions) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(FIELD_OPTIONS, options, target.constructor, key)
  }
}
