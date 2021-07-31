import * as _ from './core'

export const assign = Object.assign
export const isObjectId = (text) => /^[a-f\d]{24}$/i.test(text)

export function isEqualWithKeys(a, b, keys) {
  return _.isEqual(customPick(a, keys), customPick(b, keys))
}

export function customDefaultsMerge(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export function defaultsDeepWith(
  source,
  customizer = customDefaultsMerge,
  ...args
) {
  args.push(undefined, source, customizer)
  return _.mergeWith.apply(undefined, args)
}

export function customGet(source, path, defaultData) {
  if (path) {
    return _.get(source, path, defaultData)
  }
  return source
}

export function customPick(source, path) {
  if (path && path.length) {
    return _.pick(source, path)
  }
  return source
}

export function removeEmptyProperties(obj) {
  if (typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (_.isEmpty(value)) {
      delete obj[key]
    } else {
      removeEmptyProperties(value)
    }
  })
}

export function customUnset(value, path = '') {
  const subPaths = path.split('.')
  let parent = value
  let curPath = ''
  const arr = []

  for (let index = 0; index < subPaths.length; index++) {
    curPath = subPaths[index]
    if (!(curPath in parent)) {
      return value
    }
    const curValue = parent[curPath]
    if (!curValue || _.isEmpty(curValue)) {
      break
    }
    arr.unshift({ path: curPath, parent })
    parent = curValue
  }

  for (let index = 0; index < arr.length; index++) {
    const item = arr[index]
    if (Array.isArray(item.parent)) {
      item.parent.splice(item.path, 1)
    } else {
      delete item.parent[item.path]
    }
    if (!_.isEmpty(item.parent)) break
  }

  return value
}

export function customMapValues(obj, mapValueFunction) {
  const result = {}
  Object.keys(obj).forEach((key) => {
    result[key] = mapValueFunction(obj[key], key)
  })
  return result
}

export function omitByKeys(obj, keys) {
  return _.omitBy(obj, (v, k) => keys.includes(k))
}
