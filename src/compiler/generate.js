function genProps(attrs) {
    //将数组拼成对象
    let str = ''
    for(let i=0; i< attrs.length; i++) {
        let attr = attrs[i]
        if(attr.name === 'style') {
            let styleObj = {}
            attr.value.replace(/([^:;]+)\:([^:;]+)/g,function() {
                styleObj[arguments[1]] = arguments[2]
            })
            attr.value = styleObj 
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `${str.slice(0,-1)}`
}


export function generate(el) {
    console.log("======")
    //遍历树，生成对应字符串
    let code = `_c('${el.tag}',${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    })`

    return code
} 