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

strats.components = function(parentVal,childVal) {
  let options = Object.create(parentVal) // 根据父对象构造一个新对象options.__proto__
  if(childVal) {
     for(let key in childVal) {
       options[key] = childVal[key] 
     }
  }
  return options
}

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
      // ✨✨✨此处使用策略模式 key为lifeCycleHooks中的以及strats.components
      // 他们共同点都是传入parentVal,childVal两个参数
      if(strats[key]) {
        //对一些生命周期的合并
        options[key] = strats[key](parentVal,childVal)
      } else {
        //对一些参数的合并
        if(isObject(parentVal) && isObject(childVal)) {
          options[key] = {...parentVal,...childVal}
        } else {
          options[key] = child[key] || parent[key]
        }
      }
    }
    return options
}

// 判断是否是组件
export function isReservedTag(str) {
     let reservedTag = 'a,div,span,p,img,button,ul,li'
    return reservedTag.includes(str)
}