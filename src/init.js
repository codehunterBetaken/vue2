import {
  initState
} from "./state"

import { compileToFunction} from "./compiler/index";
import { mountComponent } from "./lifecycle";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(vm)
    if (vm.$options.el) {
      //将数据挂载到模版上
      vm.$mount(vm.$options.el)

    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    console.log(el)
    if(!options.render) { //没有render的情况下用template
        let template  = options.template
        if(!template && el) { //没有template的情况下，取el的内容作为模版
          template = el.outerHTML
          let render = compileToFunction(template)
          options.render = render
        }
    }
    console.log(options.render)
        
    mountComponent(vm,el)//组件的挂载流程
  }
}