import Watcher from "./observe/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    const preVnode = vm._vnode
    //初次渲染
    if(!preVnode) {
      vm.$el = patch(vm.$el,vnode)
    } else {
      vm.$el = patch(preVnode,vnode)
    }
    vm._vnode = vnode
  }
  Vue.prototype.$nextTick = nextTick
}

// 后续每个组件渲染的时候都会有一个watcher
export function mountComponent(vm, el) {

  //更新函数 数据变化后再次调用
  let updateComponent = () => {
    //调用render函数，生成虚拟dom
    vm._update(vm._render())
    // 用虚拟dom生成真实dom
  }
  callHook(vm,'beforeMount')
  // updateComponent()
  // 每个组件都会创建一个watcher
  new Watcher(vm,updateComponent,()=>{
    console.log('更新试图了')
  },true) //true 是一个渲染watcher

  callHook(vm,'mounted')
}

export function callHook(vm, hook) {
  //在初始化的传入的options里可能有相同的hook被合并，所以这里是一个数组
  let handlers = vm.$options[hook]
  if(handlers) {
    for(let i= 0; i<handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}