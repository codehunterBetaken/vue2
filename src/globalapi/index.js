import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
  Vue.options = {}

  Vue.mixin = function (options) {
    this.options = mergeOptions(vm.constructor.options, options)
    return this
  }

  Vue.options._base = Vue  //子类中可以找到父类

  Vue.options.components = {}

  Vue.component = function (id,definition) {
    // 保证组件的隔离

    definition = this.options._base.extend(definition)
    this.options.components[id] = definition
  }

  // 返回一个继承类
  Vue.extend = function (opts) {
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(Super.options,opts) //只和 Vue的options合并
    return Sub 
  }
} 
