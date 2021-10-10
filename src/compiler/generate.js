const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // (.+)默认是贪婪匹配 (.+?)为惰性匹配
function genProps(attrs) {
  //将数组拼成对象
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let styleObj = {}
      attr.value.replace(/([^:;]+)\:([^:;]+)/g, function () {
        styleObj[arguments[1]] = arguments[2]
      })
      attr.value = styleObj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0,-1)}}`
}

function gen(el) {
  if (el.type == 1) {
    return generate(el)
  } else {
    let text = el.text
    //文本的虚拟dom _v()
    //有变量的情况
    if (defaultTagRE.test(text)) {
      let tokens = []
      let match
      // defaultTagRE.lastIndex = 0 是一个细节 /g 带来的偏移量每次遇到新的文本时候需要归0
      // 正则的lastIndex 属性用于规定下次匹配的起始位置。该属性只有设置标志 g 才能使用。
      // 上次匹配的结果是由方法 RegExp.exec() 和 RegExp.test() 找到的，它们都以 lastIndex 属性所指的位置作为下次检索的起始点。
      // 这样，就可以通过反复调用这两个方法来遍历一个字符串中的所有匹配文本。
      let lastIndex = defaultTagRE.lastIndex = 0 //css-loader 原理相同
      while (match = defaultTagRE.exec(text)) {
        let index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        //{{aaa}} match[0] 为{{aaa}} match[1] 为aaa
        tokens.push(`_s(${match[1].trim()})`) //JSON.stringify()
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    } else {
      //无变量的情况
      return `_v('${text}')`
    }

  }
}

function genChildren(el) {
  let children = el.children;
  if (children) {
    //对于子元素进行，拼接
    return children.map(c => gen(c)).join(',')
  }
}

export function generate(el) {
  //遍历树，生成对应字符串
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${
      children?`,${children}` : ''
    })`

  return code
}