export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    console.log(vnode)
  }
}

export function mountComponent(vm, el) {
  //更新函数 数据变化后再次调用
  let updateComponent = () => {
    //调用render函数，生成虚拟dom
    vm._update(vm._render())
    // 用虚拟dom生成真实dom
  }
  updateComponent()

}