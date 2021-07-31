import { ENTITY_META } from './constants'

export interface EntityMeta {}

export interface FieldOptions {
  editor?: string
}

export function Meta(meta: EntityMeta) {
  return function (constructor: any) {
    Reflect.defineMetadata(ENTITY_META, constructor, meta)
  }
}

export function FieldOption(options: FieldOptions) {
  return function (target: any) {
    Reflect.defineMetadata(ENTITY_META, target.constructor, options)
  }
}
