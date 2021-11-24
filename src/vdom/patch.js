export function patch(oldVnode, vnode) {
  if(!oldVnode) {
     return createElm(vnode) // 如果没有el元素，那就直接根据虚拟节点直接生成真实节点返回
  }
  // 关于nodeType的解释 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
  if (oldVnode.nodeType == 1) { //1为真实节点
    const parentElm = oldVnode.parentNode //找到父节点便于删除当前真实dom

    let elm = createElm(vnode)
    // Node.nextSibling 是一个只读属性，返回其父节点的 childNodes 列表中紧跟在其后面的节点
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nextSibling
    // insertBefore 的写法是用来替换之前的节点
    parentElm.insertBefore(elm, oldVnode.nextSibling)
    parentElm.removeChild(oldVnode)
    return elm
  }
}

function createComponent(vnode) {
  //有hook方法说明是组件
  let i = vnode.data
  if((i = i.hook) && (i = i.init)) {
    // 执行组件的data.hook.init方法 对组件进行挂载
    i(vnode)
  }
  //说明是个组件
  if(vnode.componentInstance) {
    return true
  }
}

function  createElm(vnode) {
  let {tag,data,children,text,vm} = vnode
  if(typeof tag === 'string') { //元素 组件
    //组件分支
    if(createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
     
    vnode.el = document.createElement(tag) //在虚拟节点上挂一个el属性为真实节点
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {   //文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}