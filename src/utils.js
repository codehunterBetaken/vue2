export function  isFunction(val) {
  return typeof val === 'function'
}

export function  isObject(val) {
  //必须是对象 null为历史遗留问题
  return typeof val === 'object' && val !== null
}