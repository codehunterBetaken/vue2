import babel from 'rollup-plugin-babel'
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
    })

  ]
}