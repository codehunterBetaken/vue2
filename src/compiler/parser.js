const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` //标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //<aa:xxx></aa:xxx>复杂标签 用来获取标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`) //匹配开始标签  
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //结束标签 [^>]*
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //?: 为匹配且不保存
const startTagClose = /^\s*(\/?)>/  //匹配标签的关闭 />


function createAstElement(tagName,attrs) {
  return {
    tag: tagName,
    type: 1,
    children:[],
    parent:null,
    attrs
  }
}

let root = null
let stack = []

// html字符串解析成对应的脚本来触发
function start(tagName,attributes) {
    let parent = stack[stack.length -1]
    let element = createAstElement(tagName,attributes)
    if(!root) {
      root = element
    }
    
    if(parent) { //细节，parent有可能没有
      element.parent = parent
      parent.children.push(element)
    }
    stack.push(element)
}
function end(tagName) {
  let last = stack.pop()
  if(last.tag !== tagName) {
     throw new Error("标签闭合有误")
  }

}

function chars(text) {
  text = text.replace(/\s/g,"")
  let parent = stack[stack.length -1]
  if(text) {
    parent.children.push({
      type: 3,
      text
    })
  }
}

export function parserHTML(html) {
  //删除处理过的部分
  function advance(len) {
    html = html.substring(len)
  }

  // 处理标签开始部分 标签名，标签属性
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName : start[1],
        attrs: []
      }
      advance(start[0].length) //start[1] dev start[0] <div
      let end
      let attr
      // 非结尾符号>的参数 
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({name: attr[1],value: attr[3]||attr[4]||attr[5]})
        advance(attr[0].length)
      }
      if(end) {
        advance(end[0].length)
      }
      return match
    }
    return false
    }

  while(html) { //看要解析的内容是否存在，如果存在就不停解析 
    let textEnd = html.indexOf('<')
    if(textEnd == 0) {
      const startTagMatch = parseStartTag()
      if(startTagMatch) {
        //解析出标签名，参数
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue
      }

      //结束标签
      const endTagMatch = html.match(endTag)
      if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }

    //开始标签与结束标签中间的内容
    let text
    if(textEnd >0) {
      text = html.substring(0,textEnd)
      if(text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}
