import {
  isObject
} from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

//1.对对象的所有属性进行劫持
//2.数组的情况对数组的方法进行劫持，对数组中是对象的项也进行劫持

// 如果给对象新增一个属性，不会触发视图更新。（给对象本身增加一个dep，dep中存watcher，如果增加一个属性，手动触发watcher的更新）



//检测数据变化   类有类型 可以知道是谁的实例，对象没有
class Observer {
  constructor(data) { //对对象内的所有属性进行劫持
    this.dep = new Dep()
    // 把this带到数组劫持里使用，所有被劫持的属性都添加了 __ob__
    //构造函数的this指的是当前对象的实例
    //data.__ob__ =this  //由于__ob__也是一个对象，被遍历会死循环
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    
    //数组需要劫持改变他的方法。劫持对象效率太低
    if(Array.isArray(data)) {
      data.__proto__ = arrayMethods
      //如果内容是对象，需要对其进行监控
      this.observerArray(data)
    } else {
      this.walk(data)
    }
  }

  observerArray(data) {
    data.forEach(item => {
      observe(item)
    })
  }

  walk(data) {
    //遍历本身不会去遍历原型链
    //对数组原有的方法进行改写，切片编程，高阶函数
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function dependArray(value) {
    for(let i = 0; i < value.length; i++) {
        let current  = value[i]
        current.__ob__ && current.__ob__.dep.depend()
        if(Array.isArray(current)){
          dependArray(current)
        }
    }
}

//vue2 会对对象进行遍历，将每个属性 用defineProperty 重新定义 性能差
function defineReactive(data, key, value) {
  //value也可能是对象
  observe(value)
  let dep = new Dep() //每个属性都有一个dep属性

  let childOb = observe(value)
   
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) {
        dep.depend()
        if(childOb) { // 数组或者对象，对象在$set的时候也会用到
          childOb.dep.depend()
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newV) {
      if(newV !== value) {
        observe(newV) //如果用户赋值一个新对象也需要对这个对象进行劫持
        value = newV
        dep.notify()
      }
    }
  })
}
export function observe(data) {
  if (!isObject(data)) {
    return
  }
  //无需重复观测
  if(data.__ob__) {
    return data.__ob__
  }
  return new Observer(data)
}