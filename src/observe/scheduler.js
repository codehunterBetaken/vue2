import { nextTick } from "../utils"

let queue = []
let has = {}

function flushSchedulerQueue(params) {
  for(let i =0; i< queue.length; i++) {
    queue[i].run()
  }
  queue = []
  has = {}
  panding = false
}


let panding = false
export function queueWatcher(watcher) {
  const id = watcher.id
  if(has[id] == null) {
    queue.push(watcher)
    has[id] = true
    if(!panding) {
      // setTimeout(flushSchedulerQueue, 0);
      nextTick(flushSchedulerQueue);
      panding = true
    }
  }
}