import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0
class Watcher {
  constructor(vm,exprOrFn,cb,options) {
      this.vm = vm
      this.exprOrFn = exprOrFn
      this.cb = cb
      this.options = options
      this.id = id++

      this.getter = exprOrFn
      this.deps = []
      this.depsId = new Set()
      this.get()
       
  } 
  get(){
    // 属性和watcher之间是多对多的关系
    pushTarget(this)
    this.getter()
    popTarget()
  }
  update() { //vue中的更新是异步的
    // this.get()
    queueWatcher(this) //多次调用update，我希望先将watcher缓存
  }
  run() {
    //后继会有新的类型的watcher
    this.get()
  }

  // 可以在传进来的dep上添加此watcher
  addDep(dep) {
     let id = dep.id
     if(!this.depsId.has(id)) {
        this.depsId.add(id)
        this.deps.push(dep)
        dep.addSub(this)
     }
  }
}

export default Watcher