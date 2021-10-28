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
    //Dep.target 作用只有需要的才会收集依赖
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }

  //依赖收集
  addSub(watcher){
    this.subs.push(watcher)
  }

  // 调用依赖收集的Watcher更新
  notify() {
    this.subs.forEach(watcher=> watcher.update())
  }

}

Dep.target = null

let stack = []

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
  console.log('--pushTarget--,watcherid:',watcher.id,'stackLength',stack.length)
}

export function popTarget() {
  let consoleValue = stack.pop()
  
  Dep.target = stack[stack.length-1]
  console.log('---popTarget---','popWatcherid:',consoleValue.id,'now depTarget:',Dep.target && Dep.target.id)
}

export default Dep