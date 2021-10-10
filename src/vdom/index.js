export function createElement(vm, tag, data = {}, ...children) { //data可能没有值，此处给一个默认值
  return vnode(vm,tag,data,data.key,children,undefined)
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