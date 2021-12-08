import { nextTick } from "../utils"

let queue = []
let has = {}

function flushSchedulerQueue(params) {
  debugger
  queue.sort((a,b)=> a.id - b.id)
  for(let i =0; i< queue.length; i++) {
    // 执行视图的更新
    queue[i].run()
  }
  queue = []
  has = {}
  panding = false
}

let panding = false
// 多次调用watcher的update以后只会记录一次watcher
// panding 会在nextTick执行完以后打开
export function queueWatcher(watcher) {
  const id = watcher.id
  if(has[id] == null) {
    queue.push(watcher)
    has[id] = true
    if(!panding) {
      // setTimeout(flushSchedulerQueue, 0);
      nextTick(flushSchedulerQueue)
      panding = true
    }
  }
}