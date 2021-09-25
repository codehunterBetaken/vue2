import {
  isObject
} from "../utils";

//检测数据变化   类有类型 可以知道是谁的实例，对象没有
class Observer {
  constructor(data) { //对对象内的所有属性进行劫持
    this.walk(data)
  }
  walk(data) {
    //遍历本身不会去遍历原型链
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}
//vue2 会对对象进行遍历，将每个属性 用defineProperty 重新定义 性能差
function defineReactive(data, key, value) {
  //value也可能是对象
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newV) {
      observe(value) //如果用户赋值一个新对象也需要对这个对象进行劫持
      value = newV
    }
  })
}
export function observe(data) {
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}