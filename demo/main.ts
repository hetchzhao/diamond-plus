import { createApp } from 'vue'
// TODO: vue的扩展名无效
import App from './App.vue'
// TODO: tsx的扩展名无效
// import App from './App.tsx'

import DiamondPlus from '../src/index'
// import DiamondPlus from '../build/js/lib'
// import Vuf from '../build/js/lib.js'

import ElementPlus from 'element-plus'

createApp(App)
  // .use(ElementPlus)
  .use(DiamondPlus)
  .mount('#app');