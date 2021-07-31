import * as _ from '../lodash'

export function set(key: string) {
  return function (state: any, value: any) {
    _.set(state, key, value)
  }
}
