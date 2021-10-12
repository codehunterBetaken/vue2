import { generate } from "./generate"
import { parserHTML } from "./parser"

export function compileToFunction(template) {
  
 let root =  parserHTML(template)
  //html => ast(只能描述语法) => render => vdom(增加额外的属性描述) => 生成真实dom
  let code = generate(root)

//解析为ast的字符串后使用 eval耗性能，有作用域问题
//模版引擎 Function + with <= with的语法知识 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with
let render = new Function(`with(this){return ${code}}`)  //code里有变量，已经挂在了vm上 render.call(vm)

return render
}  