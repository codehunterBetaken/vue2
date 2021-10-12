export function patch(oldVnode, vnode) {
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

function  createElm(vnode) {
  let {tag,data,children,text,vm} = vnode
  if(typeof tag === 'string') { //元素
    vnode.el = document.createElement(tag) //在虚拟节点上挂一个el属性为真实节点
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {   //文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}