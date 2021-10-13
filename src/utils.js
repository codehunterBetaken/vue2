export function isFunction(val) {
  return typeof val === 'function'
}

export function isObject(val) {
  //必须是对象 null为历史遗留问题
  return typeof val === 'object' && val !== null
}

const callbacks = []

function flushCallbacks() {
  callbacks.forEach(cb => cb())
  waiting = false
}
let waiting = false
function timer(flushCallbacks) {
  let timerFn = () => {}

  //微任务是在dom渲染前执行的，此处用到的vm.$el是内存内的，并不与dom渲染是否完毕有关
  if (Promise) {
    timerFn = () => {
      Promise.resolve().then(flushCallbacks)
    }
  } else if (MutationObserver) {
    let textNode = document.createTextNode(1)
    let observe = new MutationObserver(flushCallbacks)
    observe.observe(textNode, {
      charaterData: true
    })
    timerFn = () => {
      textNode.textContent = 3
    }
  } else if (setImmediate) {
    timerFn = () => {
      setImmediate(flushCallbacks)
    }
  } else {
    timerFn = () => {
      setTimeout(flushCallbacks, 0);
    }
  }
  timerFn()
}


export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    timer(flushCallbacks)
    waiting = true
  }
}