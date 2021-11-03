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
  // 初始化
  let timerFn = () => {}

  //微任务是在dom渲染前执行的，此处用到的vm.$el是内存内的，并不与dom渲染是否完毕有关
  //macrotasks: setTimeout ，setInterval， setImmediate，requestAnimationFrame,I/O ，UI渲染
  //microtasks: Promise， process.nextTick， Object.observe， MutationObserver
  //1.先执行 macrotasks：I/O -> UI渲染 ->requestAnimationFrame
  //2.再执行 microtasks ：process.nextTick -> Promise -> MutationObserver -> Object.observe
  //3.再把setTimeout setInterval setImmediate【三个货不讨喜】 塞入一个新的macrotasks，依次：setTimeout ，setInterval -->setImmediate

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

// waiting 用于当前tick未执行完的阻塞，比如$nextTick的调用
// 会在数据更新的set调用的nextTick(flushSchedulerQueue)之后
// 在主线程上，如果再遇到macrotask，就把它放到macrotask任务队列末尾，由于一次event loop只能取一个macrotask，
// 所以遇到的宏任务就需要等待其它轮次的事件循环了；如果遇到microtask，则放到本次循环的microtask队列中去。
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    timer(flushCallbacks)
    waiting = true
  }
}

let lifeCycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats = {}

function mergeHook(parentVal,childVal) {
  if(childVal) {
    if(parentVal) {
        return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  }else {
    return parentVal
  }
}

lifeCycleHooks.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
    const options = {}
    for(let key in parent) {
      mergeField(key)
    }
    for(let key in child) {
      if(parent.hasOwnProperty(key)) {
        continue
      }
      mergeField(key)
    }

    function  mergeField(key) {
      let parentVal = parent[key]
      let childVal = child[key]
      if(strats[key]) {
        options[key] = strats[key](parentVal,childVal)
      } else {
        if(isObject(parentVal) && isObject(childVal)) {
          options[key] = {...parentVal,...childVal}
        } else {
          options[key] = child[key]
        }
      }
    }
    return options
}