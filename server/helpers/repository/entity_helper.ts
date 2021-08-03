import { connection } from '@/server/config/mongo'
import { get, kebabCase, pick, set } from '@/utils/lodash'
import { KEYS, Repository } from '@nguyenduclong/mongodbts'
import { getMetadataStorage, ValidationTypes } from 'class-validator'
import { FIELD_OPTIONS } from './constants'

interface ValidateItem {
  name: string
  constraints: any[]
  each: boolean
}

export interface EntityDeclaration extends AnyObject {
  id: string
  description: string
  name: string
  endpoint: string
  schema: {
    [x: string]: SchemaField
  }
}

export interface SchemaField {
  type?: string
  label?: string
  auto?: boolean
  isArray?: boolean
  unique?: boolean
  required?: boolean
  minlength?: number
  maxlength?: number
  min?: number
  max?: number
  ref?: string
  enum?: any[]
  validate?: ValidateItem[]
  props: any
}

export class EntityHelper {
  private static cache = new Map<any, any>()
  private static cacheValidate = new Map<any, any>()

  static getEntities() {
    const entities: EntityDeclaration[] = []
    Repository.getRepositories(connection).forEach((repository) => {
      const entityName = repository.name
      const endpoint = '/api/entity/' + kebabCase(entityName) + 's'
      const schema = this.getEntitySchema(repository)
      const options = pick(
        Reflect.getMetadata(KEYS.SCHEMA_OPTIONS, repository.entityCls),
        'name',
        'description'
      )

      entities.push({
        id: entityName,
        ...options,
        name: options.name || entityName,
        endpoint,
        schema,
      })
    })

    return entities
  }

  static getEntitySchema(
    repository: Repository<any>
  ): EntityDeclaration['schema'] {
    const cache = this.cache.get(repository.entityCls)
    if (cache) return cache

    // get schema
    const validateSchema = this.getEntityValidate(repository.entityCls)
    const schema =
      Reflect.getMetadata(KEYS.SCHEMA_RAW, repository.entityCls) || {}

    // console.log(schema)

    Object.keys(schema).forEach((key) => {
      if (validateSchema[key]) {
        set(schema, `${key}.validate`, validateSchema[key])
      }

      const fieldOptions = Reflect.getMetadata(
        FIELD_OPTIONS,
        repository.entityCls,
        key
      )

      if (fieldOptions) {
        Object.assign(schema[key], fieldOptions)
      }
    })

    this.cache.set(repository.entityCls, schema)

    return schema
  }

  static getEntityValidate(cls: any) {
    if (this.cacheValidate.get(cls)) return this.cacheValidate.get(cls)

    const metadatas = [
      ...getMetadataStorage().getTargetValidationMetadatas(
        cls,
        null,
        false,
        false
      ),
    ]

    metadatas.forEach((item) => {
      if (item.constraintCls) {
        ;(item as any).__constraints =
          getMetadataStorage().getTargetValidatorConstraints(item.constraintCls)
      }
    })

    const defined = getMetadataStorage().groupByPropertyName(metadatas)
    const schema: { [x: string]: ValidateItem[] } = {}

    Object.keys(defined).forEach((key) => {
      schema[key] = defined[key].map((item) => {
        if (item.type === ValidationTypes.CONDITIONAL_VALIDATION) {
          return {
            name: 'isOptional',
            each: item.each,
          }
        }

        if (item.type === ValidationTypes.CUSTOM_VALIDATION) {
          return {
            name: get(item, '__constraints[0].name'),
            each: item.each,
            constraints: item.constraints,
          }
        }
        return null as any
      })
    })

    this.cacheValidate.set(cls, schema)

    return schema
  }
}
