import {
  initState
} from "./state"

import { compileToFunction} from "./compiler";
import { mountComponent } from "./lifecycle";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // options 为index.html里new Vue时候传入的参数 包括了data在initState会使用到
    vm.$options = options
    //首先是对state数据的劫持处理
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
    //用于虚拟dom替换时找到节点
    vm.$el = el
    if(!options.render) { //没有render的情况下用template
        let template  = options.template
        if(!template && el) { //没有template的情况下，取el的内容作为模版
          template = el.outerHTML
          let render = compileToFunction(template)
          options.render = render
        }
    }
        
    mountComponent(vm,el)//组件的挂载流程
  }
}