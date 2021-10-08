import { parserHTML } from "./parser"

export function compileToFunction(template) {
  
 let root =  parserHTML(template)
  console.log(root)
  //html => ast(只能描述语法) => render => vdom(增加额外的属性描述) => 生成真实dom
} 