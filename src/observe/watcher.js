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
    this.dirty = options.lazy
    this.cb = cb
    this.options = options
    this.id = id++

    if (typeof exprOrFn == 'string') {
      //data依赖收集走此处
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
      //watch依赖走此处
      this.getter = exprOrFn
    }

    this.deps = []
    this.depsId = new Set()
    console.log('new watcher,lazy:',this.lazy,'watcher id:' + this.id)
    this.value = this.lazy ? undefined : this.get() // 第一次的value

  }
  get() {
    // 属性和watcher之间是多对多的关系
    pushTarget(this)
    // 注意此处的this如果不加call(this.vm)的话this指向的是watcher本身，
    // 在执行的computed里的this就会指向错误找不到挂在vm上的其他变量
    const value = this.getter.call(this.vm)
    popTarget()
    return value
  }
  update() { //vue中的更新是异步的
    // this.get()
    if (this.lazy) {
      console.log('watcher-update,watcher id:',this.id)
      this.dirty = true
    } else {
      queueWatcher(this) //多次调用update，我希望先将watcher缓存
    }

  }
  //更新视图
  run() {
    let newValue = this.get()
    let oldValue = this.value
    this.value = newValue
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }

  }
  //收集依赖
  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  // 可以在传进来的dep上添加此watcher
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      console.log('watcher id:',this.id,'deps里添加: diepid:',dep.id)
      this.deps.push(dep)
      // 同样在dep里把当前的watcher收集起来
      console.log('depid' ,dep.id,'add watcher id:',this.id)
      dep.addSub(this)
    }
  }

  //案例中 当data.name值发生变化时会执行此方法
  evaluate() {
    console.log('evaluate start')
    this.dirty = false
    this.value = this.get()
    console.log('evaluate end value:',this.value)
  }

}

export default Watcher