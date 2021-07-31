import { Repository } from '@nguyenduclong/mongodbts'
import { FilterQuery } from 'mongoose'

export function createIfNotExits<E extends object>(
  repository: Repository<E>,
  query: FilterQuery<E>,
  data = query,
  onCreate: any = null,
  options: any = { cascade: true }
) {
  return repository
    .findOne({
      query,
    })
    .then((doc) => {
      if (!doc) {
        onCreate && onCreate()
        return repository.create({
          data: data as any,
          cascade: true,
          ...options,
        })
      }
      return doc
    })
}
