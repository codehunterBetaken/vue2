import {
  popTarget,
  pushTarget
} from "./dep"
import {
  queueWatcher
} from "./scheduler"

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.user = !!options.user //判断是否是用户watcher  ！！用来转布尔型
    this.lazy = !!options.lazy // computed属性第一次不需要执行
    this.cb = cb
    this.options = options
    this.id = id++

    if (typeof exprOrFn == 'string') {
      this.getter = function () {
        // 数据取值时，进行依赖收集
        // return vm[exprOrFn]
        let path = exprOrFn.split('.')
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    } else {
      this.getter = exprOrFn
    }

    this.deps = []
    this.depsId = new Set()
    this.value = this.lazy? undefined: this.get() // 第一次的value

  }
  get() {
    // 属性和watcher之间是多对多的关系
    pushTarget(this)
    const value = this.getter()
    popTarget()
    return value
  }
  update() { //vue中的更新是异步的
    // this.get()
    queueWatcher(this) //多次调用update，我希望先将watcher缓存
  }
  run() {
    //后继会有新的类型的watcher
    let newValue = this.get()
    let oldValue = this.value
    this.value = newValue
    if(this.user) {
      this.cb.call(this.vm,newValue,oldValue)
    }

  }

  // 可以在传进来的dep上添加此watcher
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}

export default Watcher