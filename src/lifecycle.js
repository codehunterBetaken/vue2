import Watcher from "./observe/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    // 既有初始化，又有更新
    vm.$el = patch(vm.$el,vnode)
  }
}

export function mountComponent(vm, el) {
  //更新函数 数据变化后再次调用
  let updateComponent = () => {
    //调用render函数，生成虚拟dom
    vm._update(vm._render())
    // 用虚拟dom生成真实dom
  }
  // updateComponent()
  new Watcher(vm,updateComponent,()=>{
    console.log('更新试图了')
  },true) //true 是一个渲染watcher
}