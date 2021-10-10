let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype)
// arrayMethods.__proto__ = Array.prototype 继承
let methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function(...args) {
        let ob =this.__ob__ //根据当前数组获取observer实例
        console.log('数组方法被调用')
        oldArrayPrototype[method].call(this,...args)
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                //splice的第三个参数才是添加的内容
                inserted = args.slice(2)
        
            default:
                break;
        }
        if(inserted)  ob.observerArray(inserted)
    }
})