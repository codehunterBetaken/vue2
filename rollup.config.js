import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'; //需要添加插件node_resolve_plugin 才能去找默认的index
export default {
  input: './src/index.js',
  output: {
    format: 'umd', //支持 amd和 commonjs规范 window.Vue
    name: 'Vue',
    file:'dist/vue.js',
    sourcemap:true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve()

  ]
}