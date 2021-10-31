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

export default Vue