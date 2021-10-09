import { generate } from "./generate"
import { parserHTML } from "./parser"

export function compileToFunction(template) {
  
 let root =  parserHTML(template)
  //html => ast(只能描述语法) => render => vdom(增加额外的属性描述) => 生成真实dom
  let code = generate(root)
  console.log(code)
} 