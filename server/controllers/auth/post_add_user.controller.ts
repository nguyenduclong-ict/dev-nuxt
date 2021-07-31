import { DefaultRole } from '@/server/entities'
import { Controller, params } from '@/server/helpers/controller'
import { hasPassword } from '@/server/helpers/crypt'
import { ENTITY_EXIST, FORBIDDEN } from '@/server/helpers/errors'
import { roleRepository, userRepository } from '@/server/repository'
import { idIsEqual, toMongoId } from '@nguyenduclong/mongodbts'
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

class Params {
  @MinLength(4)
  username: string

  @MinLength(4)
  password: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  @IsBoolean()
  blocked: boolean

  @IsBoolean()
  isAdmin: boolean

  @IsString({ each: true })
  roles: any[]
}

@params(Params)
export class PostAddUserController extends Controller<Params> {
  async main() {
    if (
      await userRepository.findOne({
        query: { username: this.params.username },
      })
    ) {
      return this.sendError(ENTITY_EXIST)
    }

    const authenticatedRole = await roleRepository.findOne({
      query: {
        isDefault: true,
        name: DefaultRole.AUTHENTIACATED,
      },
    })

    if (!this.params.roles.find((e) => idIsEqual(e, authenticatedRole.id))) {
      this.params.roles.push(toMongoId(authenticatedRole.id))
    }

    if (this.params.isAdmin && !this.req.meta.user.isAdmin) {
      return this.sendError(FORBIDDEN)
    }

    const user = await userRepository.create({
      data: {
        ...this.params,
        password: hasPassword(this.params.password),
        blocked: this.params.blocked,
        profile: {},
        permissions: [],
      },
      populates: ['roles'],
    })

    this.res.json(user)
  }
}
