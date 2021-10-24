import { observe } from "./observe/index"  //需要添加插件node_resolve_plugin 才能去找默认的index
import Watcher from "./observe/watcher"
import { isFunction } from "./utils"

export function stateMixin(Vue) {
   Vue.prototype.$watch = function(key, handler, options = {}) {
     // 仅是一个用户watcher的标识位
     options.user = true
      new Watcher(this,key,handler,options)
   }
}

export function initState(vm) {
  const otps = vm.$options
  //new vue 的时候如果传入了data
  if(otps.data) {
    initData(vm)
  }
  if(otps.computed) {
    initComputed(vm,otps.computed)
  }
  //对所有的watcher进行绑定
  if(otps.watch) {
    initWatch(vm,otps.watch)
  }
   
}
// 对vm上的属性进行存取值通过代理改变_data上的值
function proxy(vm,source,key) {
  Object.defineProperty(vm,key,{
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}
function initData(vm) {
  let data =vm.$options.data  //以$开头的不会做代理
  // vue2 data中数据使用数据劫持   
  // 保证当前的this一直是vm所以使用call调用
  // **vm和data没有关系，通过_data去关联 **
  data = vm._data = isFunction(data) ? data.call(vm) : data
  
  // 把data里的所有数据都挂到了vm上，并代理到_data上
  for(let key in data) {
    proxy(vm,'_data',key)
  }

  //对vm._data上所有数据进行劫持操作
  observe(data)
}

function initWatch(vm, watch) {
  for(let key in watch) {
    let handler = watch[key]
    //对watcher是数组的情况进行处理
    if(Array.isArray(handler)) {
        for(let i=0;i<handler.length; i++) {
          createWatcher(vm,key,handler[i])
        } 
    } else {
      createWatcher(vm,key,handler)
    }

  }
}

// 新建watcher并绑定 详见Watcher.js的 exprOrFn == 'string' 分支
function createWatcher(vm,key,handler) {
  return vm.$watch(key,handler)
}

function initComputed(vm,computed) {
  const watchers = vm._computedWatchers = []
  for(let key in computed) {
    const userDef = computed[key]
    let getter = typeof userDef == 'function' ? userDef : userDef.get
    // 每个计算属性本质就是watcher
    watchers[key] = new Watcher(vm,getter,()=>{},{lazy: true}) //默认不执行
    //把key定义到vm上
    defineComputed(vm,key,userDef)

  }
}

function createComputedGetter(key) {
    return function computedGetter() {
     let watcher = vm._computedWatchers[key]
     if(watcher.dirty) {
       watcher.evaluate();
     }
     return watcher.value
    }
}

function defineComputed(vm,key,userDef) {
  let sharedProperty = {}
  if(typeof userDef == 'function') {
    sharedProperty.get = userDef
  } else {
    sharedProperty.get = createComputedGetter(key)
    sharedProperty.set = userDef.set
  }
  Object.defineProperty(vm,key,sharedProperty)
}