import {
  initState
} from "./state"

import { compileToFunction} from "./compiler";
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions } from "./utils";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // options 为index.html里new Vue时候传入的参数 包括了data在initState会使用到
    vm.$options = mergeOptions(vm.constructor.options,options)  // TODO this.constructor.options出于可能会有自组件的情况，需要复习一下this的相关知识
    callHook(vm,'beforeCreate')
    //首先是对state数据的劫持处理
    initState(vm)
    callHook(vm,'created')
    if (vm.$options.el) {
      //将数据挂载到模版上
      vm.$mount(vm.$options.el)

    }
  }
  // 注意是走完子组件的生命周期再走完父组件的
  // beforeCreate parent
  // beforeCreate child
  // mounted child
  // mounted parent
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    //用于虚拟dom替换时找到节点
    vm.$el = el
    if(!options.render) { //没有render的情况下用template
        let template  = options.template
        if(!template && el) { //没有template的情况下，取el的内容作为模版
          template = el.outerHTML
        }
        let render = compileToFunction(template)
        options.render = render
    }
        
    mountComponent(vm,el)//组件的挂载流程
  }
}