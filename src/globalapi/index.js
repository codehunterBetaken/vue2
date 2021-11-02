import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
  Vue.options = {}

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    return this
  }
} 