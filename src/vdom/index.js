import { isObject, isReservedTag } from "../utils"

export function createElement(vm, tag, data = {}, ...children) { //data可能没有值，此处给一个默认值
  //判断是否事组件
  if(isReservedTag(tag)) {
    return vnode(vm,tag,data,data.key,children,undefined)
  } else {
    //组件分支
    const Ctor = vm.$options.components[tag]
    return createComponent(vm,tag,data,data.key,children,Ctor)
  }
  
}

function createComponent(vm,tag,data,key,solt,Ctor) {
  
  if(isObject(Ctor)) {
    // vm.$options._base 就是Vue
    Ctor = vm.$options._base.extend(Ctor)
  }
  // 组件自行挂载vnode
  data.hook = {
    init(vnode) {
      // vnode.componentInstance 是一个暂存值用于判断
     let vm = vnode.componentInstance = new Ctor({_isComponent: true})
     vm.$mount()
    }
  }
  return vnode(vm,`vue-component-${tag}`,data,key,undefined,undefined,{Ctor,solt})
}

export function createTextElement(vm, text) {
  return vnode(vm,undefined,undefined,undefined,undefined,text)
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}