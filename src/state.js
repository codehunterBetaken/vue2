import { observe } from "./observe/index"  //需要添加插件node_resolve_plugin 才能去找默认的index
import { isFunction } from "./utils"

export function initState(vm) {
  const otps = vm.$options

  if(otps.data) {
    initData(vm)
  }
  // if(otps.computed) {
  //   initComputed()
  // }

  // if(otps.watch) {
  //   initWatch()
  // }
   
}
function initData(vm) {
  let data =vm.$options.data
  //vue2 data中数据使用数据劫持   
  //保证当前的this一直是vm所以使用call调用
  //vm和data没有关系，通过_data去关联
  data = vm._data = isFunction(data) ? data.call(vm) : data

  observe(data)
}