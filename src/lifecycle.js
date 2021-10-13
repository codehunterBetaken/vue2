import Watcher from "./observe/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    // 既有初始化，又有更新
    vm.$el = patch(vm.$el,vnode)
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
  // updateComponent()
  // 每个组件都会创建一个watcher
  new Watcher(vm,updateComponent,()=>{
    console.log('更新试图了')
  },true) //true 是一个渲染watcher
}