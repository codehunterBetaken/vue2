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
//diff核心
let oldTemplate = `<div>{{message}}</div>`
let vm1 = new Vue({data:{message: 'hello world'}})
const render1 = compileToFunction(oldTemplate)
let newTemplate = `<p>pTemplate</p>`

export default Vue