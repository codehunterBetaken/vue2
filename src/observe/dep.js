//dep 的id 用于去重
let id = 0

//用于记录watcher
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  //Dep.target 存放的是watcher，是对watcher上把dep加入进去
  depend() {
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }

  // 是否需要在此处的watcher去重 ？？
  addSub(watcher){
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher=> watcher.update())
  }

}

Dep.target = null

let stack = []

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
  console.log(stack)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length-1]
}

export default Dep