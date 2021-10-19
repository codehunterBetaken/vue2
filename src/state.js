import { observe } from "./observe/index"  //需要添加插件node_resolve_plugin 才能去找默认的index
import Watcher from "./observe/watcher"
import { isFunction } from "./utils"

export function stateMixin(Vue) {
   Vue.prototype.$watch = function(key, handler, options = {}) {
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
  // if(otps.computed) {
  //   initComputed()
  // }
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
    if(Array.isArray(handler)) {
        for(let i=0;i<handler.length; i++) {
          createWatcher(vm,key,handler[i])
        } 
    } else {
      createWatcher(vm,key,handler)
    }

  }
}

function createWatcher(vm,key,handler) {
  vm.$watch(key,handler)
}