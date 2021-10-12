import { popTarget, pushTarget } from "./dep"

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
    console.log('ok')
    popTarget()
  }
  update() {
    this.get()
  }

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