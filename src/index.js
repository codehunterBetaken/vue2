import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue) // _render
lifecycleMixin(Vue) // _update

export default Vue