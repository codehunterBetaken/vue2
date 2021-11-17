import { isObject, isReservedTag } from "../utils"

export function createElement(vm, tag, data = {}, ...children) { //data可能没有值，此处给一个默认值
 
  if(isReservedTag(tag)) {
    return vnode(vm,tag,data,data.key,children,undefined)
  } else {
    const Ctor = vm.$options.components[tag]
    createComponent(vm,tag,data,data.key,children,Ctor)
  }
  
}

function createComponent(vm,tag,data,key,solt,Ctor) {
  
  if(isObject(Ctor)) {
    // vm.$options._base 就是Vue
    Ctor = vm.$options._base.extend(Ctor)
  }

}

export function createTextElement(vm, text) {
  return vnode(vm,undefined,undefined,undefined,undefined,text)

}

function vnode(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text
  }
}