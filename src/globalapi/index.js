import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
  Vue.options = {}

  // 把传入的options合并到主options里
  Vue.mixin = function (options) {
    this.options = mergeOptions(vm.constructor.options, options)
    return this
  }

  Vue.options._base = Vue  //子类中可以找到父类

  Vue.options.components = {}

  // 注册组件 传入 组件id ，相关参数
  Vue.component = function (id,definition) {
    // 保证组件的隔离
    definition = this.options._base.extend(definition)
    // 在options的components里存入组件
    this.options.components[id] = definition
  }

  // 返回一个继承类
  Vue.extend = function (opts) {
    const Super = this
    const Sub = function VueComponent(options) {
      // 在new组件的时候会执行_init进行初始化 此操作在vue初始化时也有类似的代码
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(Super.options,opts) //只和 Vue的options合并
    return Sub 
  }
} 
