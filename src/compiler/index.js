const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` //标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //<aa:xxx></aa:xxx>复杂标签 用来获取标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`) //匹配开始标签  
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //结束标签 [^>]*
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //?: 为匹配且不保存
const startTagClose = /^\s*(\/?)>/  //匹配标签的关闭 />
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // (.+)默认是贪婪匹配 (.+?)为惰性匹配

// html字符串解析成对应的脚本来触发
function start(tagName,attributes) {
    
}
function end(tagName) {
  
}

function chars(text) {

}

function parserHTML(html) {
  function advance(len) {
    html = html.substring(len)
    
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName : start[1],
        attrs: []
      }
      advance(start[0].length)
      let end
      let attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        console.log(end,attr)
        advance(attr[0].length)
      }
    }
    return false
    }

  while(html) { //看要解析的内容是否存在，如果存在就不停解析 
    let textEnd = html.indexOf('<')
    if(textEnd == 0) {
      const startTagMatch = parseStartTag()
      break
      // if(startTagMatch) {

      // }
      // const endTagMatch = parseEndTag()

      // if(endTagMatch) {

      // }
    }

  }
}

export function compileToFunction(template) {
  console.log(template)
  

  parserHTML(template)
  
} 