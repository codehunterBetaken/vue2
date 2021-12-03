export function patch(oldVnode, vnode) {
  if (!oldVnode) {
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
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }
    let el = vnode.el = oldVnode.el
    if (vnode.tag == undefined) { //新老都是文本
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text
      }
      return
    }
    patchProps(vnode, oldVnode.data)
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) {
      patchChildren(el, oldChildren, newChildren)
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        let child = createElm(newChildren[i])
        el.appendChild(child)
      }
    } else if (oldChildren.length > 0) {
      el.innerHTML = ``
    } 
    return el;

  }
}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key)
}

function patchChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  const makeIndexByKey = (children) => {
      return children.reduce((memo,current,index) => {
        if(current.key) {
          memo[current.key] = index
        }
        return memo
      },{})
  }

  const keysMap = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if(!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    }
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if(isSameVnode(oldEndVnode,newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if(isSameVnode(oldStartVnode,newEndVnode)) {
      patch(oldStartVnode,newEndVnode)
      el.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling) // 移动后老元素会被销毁
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if(isSameVnode(oldEndVnode,newStartVnode)) {
      patch(oldEndVnode,newStartVnode)
      el.insertBefore(oldEndVnode.el,oldStartVnode.el) // 移动后老元素会被销毁
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {  // 1.需要根据key喝对应的索引讲老的内容生成映射表
      let moveIndex = keysMap[newStartVnode.key]
      if(moveIndex == undefined) {
        el.insertBefore(createElm(newStartVnode),oldStartVnode.el)
      } else {
          let moveNode = oldChildren[moveIndex]
          oldChildren[moveIndex] = null //被移动走的地方防止塌陷，补上null，保持索引的正确性
          el.insertBefore(moveNode.el,oldStartVnode.el)
          patch(moveNode,newStartVnode)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // el.appendChild(createElm(newChildren[i]))
      // 需要向前插入剩余的还是向后插入剩余的节点，根据指针的下一个元素是否存在进行判断
      // null为往el的子元素的最后插，如果是后向前比较的就往newChildren[newEndIndex + 1].el前面插
      let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      el.insertBefore(createElm(newChildren[i]),anchor)
    }
  }

  if(oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if(oldChildren[i] !== null) {
        el.removeChild(oldChildren[i].el)
      }
    }
  }
}

function patchProps(vnode, oldProps = {}) {
  let newProps = vnode.data || {}
  let el = vnode.el

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  for (let key in newProps) {
    // style 需要特殊处理
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }

  }
}

function createComponent(vnode) {
  //有hook方法说明是组件
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    // 执行组件的data.hook.init方法 对组件进行挂载
    i(vnode)
  }
  //说明是个组件
  if (vnode.componentInstance) {
    return true
  }
}

export function createElm(vnode) {
  let {
    tag,
    data,
    children,
    text,
    vm
  } = vnode
  if (typeof tag === 'string') { //元素 组件
    //组件分支
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }

    vnode.el = document.createElement(tag) //在虚拟节点上挂一个el属性为真实节点
    patchProps(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else { //文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}