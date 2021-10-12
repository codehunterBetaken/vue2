let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }
  addSub(watcher){
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher=> watcher.update())
  }

}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}

export default Dep