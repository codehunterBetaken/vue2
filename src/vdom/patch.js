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
  } else {
    if(oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el)
    }
    let el = vnode.el = oldVnode.el
    if(vnode.tag == undefined) { //新老都是文本
      if(oldVnode.text !== vnode.text) {
        el.textContent = vnode.text
      }
      return
    }
    patchProps(vnode,oldVnode.data)
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if(oldChildren.length > 0 && newChildren.length >0) {

    } else if(newChildren.length > 0) {
      for(let i=0; i< newChildren.length; i++) {
        let child = createElm(newChildren[i])
        el.appendChild(child)
      }
    } else if(oldChildren.length >0) {
        el.innerHTML = ``
    }else {

    }
  }
}

function patchProps(vnode,oldProps={}) {
  let newProps = vnode.data || {}
  let el = vnode.el

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for(let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }

  for(let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  for(let key in newProps) {
    // style 需要特殊处理
    if(key === 'style') {
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      el.setAttribute(key,newProps[key])
    }
    
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

export function  createElm(vnode) {
  let {tag,data,children,text,vm} = vnode
  if(typeof tag === 'string') { //元素 组件
    //组件分支
    if(createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
     
    vnode.el = document.createElement(tag) //在虚拟节点上挂一个el属性为真实节点
    patchProps(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {   //文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}