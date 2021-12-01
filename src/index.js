import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"
import {stateMixin} from "./state"
import { initGlobalApi } from "./globalapi"

function Vue(options) {
  this._init(options)
}
//扩展原型
initMixin(Vue)
renderMixin(Vue) // _render
lifecycleMixin(Vue) // _update
stateMixin(Vue)

//扩展类
initGlobalApi(Vue)

import {compileToFunction} from './compiler'
import { createElm, patch } from "./vdom/patch"
//diff核心
// let oldTemplate = `<div style="color:red;background:black" a="1">{{message}}</div>`
let oldTemplate = `<div>
    <li key="C">C</li>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="D">D</li>
</div>`
let vm1 = new Vue({data:{message: 'hello world'}})
const render1 = compileToFunction(oldTemplate)
const oldVnode = render1.call(vm1)
document.body.appendChild(createElm(oldVnode))


// let newTemplate = `<p>{{message}}</p>`
let newTemplate = `<div>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
    <li key="A">A</li>
    
</div>`
let vm2 = new Vue({data:{message: 'zf'}})
const render2 = compileToFunction(newTemplate)
const newVnode = render2.call(vm2)
setTimeout(()=> {
  patch(oldVnode,newVnode)
},2000)


export default Vue