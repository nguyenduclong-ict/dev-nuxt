import {
  ArrayMinSize,
  IsArray,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator'
import { IsRequired } from '@nguyenduclong/mongodbts'

export class ParamsCreate<E = any> {
  @IsRequired()
  @IsObject()
  data: E
}

export class ParamsCreateMany<E = any> {
  @ArrayMinSize(1)
  data: E[]
}

export class ParamsUpdate<E = any> {
  @IsNotEmptyObject()
  query: any

  @IsRequired()
  @IsObject()
  data: E
}

export class ParamsDelete {
  @IsNotEmptyObject()
  query: any
}

export class ParamsList {
  // @IsOptional()
  // @IsObject()
  // query: any
  // @IsOptional()
  // @IsArray()
  // populates: any[]
  // @IsOptional()
  // @IsArray()
  // sort: any[]
  // @IsOptional()
  // @IsArray()
  // fields: string[]
  // @IsOptional()
  // @IsNumber()
  // page: number
  // @IsOptional()
  // @IsNumber()
  // pageSize: number
}
