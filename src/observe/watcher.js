class Watcher {
  constructor(vm,exprOrFn,cb,options) {
      this.vm = vm
      this.exprOrFn = exprOrFn
      this.cb = cb
      this.options = options

      this.getter = exprOrFn

      this.get()
       
  } 
  get(){
    this.getter()
  }
}

export default Watcher