import { Controller, createRollback, params } from '@/server/helpers/controller'
import { createToken, hasPassword } from '@/server/helpers/crypt'
import { ENTITY_EXIST } from '@/server/helpers/errors'
import { DefaultTokenData } from '@/server/middlewares/auth'
import {
  configRepository,
  permissionRepository,
  roleRepository,
  tokenRepository,
  userRepository,
} from '@/server/repository'
import { dayjs } from '@/utils'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { toMongoId } from '@nguyenduclong/mongodbts'
import { initRolesAndPermissions } from '@/server/seeders/roles_permissions'
class Params {
  @IsString()
  projectName: string

  @MinLength(4)
  username: string

  @MinLength(4)
  password: string

  @IsEmail()
  email: string
}

@params(Params)
export class PostInitController extends Controller<Params> {
  async main() {
    const rollback = createRollback()

    try {
      if (await configRepository.findOne({ query: { key: 'project' } })) {
        return this.sendError(ENTITY_EXIST, { message: 'Project existed!' })
      }

      const project = await configRepository.create({
        data: {
          key: 'project',
          value: {
            name: this.params.projectName,
          },
        },
      })

      rollback.add(() => project.remove())

      if (
        await userRepository.findOne({
          query: { username: this.params.username },
        })
      ) {
        await rollback.run()
        this.sendError(ENTITY_EXIST, { message: 'User existed!' })
      }

      const user = await userRepository.create({
        data: {
          username: this.params.username,
          blocked: false,
          isAdmin: true,
          password: hasPassword(this.params.password),
          email: this.params.email,
          roles: [],
          permissions: [],
          profile: {},
        },
      })

      rollback.add(() => user.remove())

      // clear database
      await Promise.all([
        permissionRepository.delete({ query: {} }),
        roleRepository.delete({ query: {} }),
        tokenRepository.delete({ query: {} }),
      ])

      // create base role
      await initRolesAndPermissions()

      // create login token
      const token = createToken<DefaultTokenData>({
        id: toMongoId(user.id),
        type: 'default',
      })

      const refreshToken = createToken(
        {
          id: toMongoId(user.id),
          type: 'refresh_token',
        },
        '60d'
      )

      await tokenRepository.create({
        data: {
          expiresAt: dayjs().add(60, 'day').toDate(),
          type: 'refresh_token',
          value: refreshToken,
        },
      })

      this.res.json({ token, refreshToken })
    } catch (error) {
      await rollback.run()
      throw error
    }
  }
}
