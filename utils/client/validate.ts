import { RuleItem } from 'async-validator'
import { get } from '../lodash'

export const equalToField = (
  model: any,
  otherKey: string,
  message: any = `Not equal to ${otherKey}`,
  options?: any
) => {
  return {
    validator: (rule: RuleItem, value: any, callback: any) => {
      if (value !== get(model, otherKey)) {
        // @ts-ignore
        return callback(message)
      }
      callback()
    },
    ...(options || {}),
  }
}

export const isVNode = (view: any) => {
  return view?.constructor.name === 'VNode'
}

export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
