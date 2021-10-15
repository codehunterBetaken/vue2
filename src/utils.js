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
  //macrotasks: setTimeout ，setInterval， setImmediate，requestAnimationFrame,I/O ，UI渲染
  //microtasks: Promise， process.nextTick， Object.observe， MutationObserver
  //1.先执行 macrotasks：I/O -> UI渲染 ->requestAnimationFrame
  //2.再执行 microtasks ：process.nextTick -> Promise -> MutationObserver -> Object.observe
  //3.再把setTimeout setInterval setImmediate【三个货不讨喜】 塞入一个新的macrotasks，依次：setTimeout ，setInterval --》setImmediate

  if (Promise) {
    timerFn = () => {
      Promise.resolve().then(flushCallbacks)
    }
  } else if (MutationObserver) {
    let textNode = document.createTextNode(1)
    let observe = new MutationObserver(flushCallbacks)
    observe.observe(textNode, {
      characterData: true
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