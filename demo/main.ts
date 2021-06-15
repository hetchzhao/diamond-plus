import { createApp } from 'vue'
// TODO: vue的扩展名无效
import App from './App.vue'
// TODO: tsx的扩展名无效
// import App from './App.tsx'

import Dia from '../src/index.ts'

// import Vuf from '../build/js/lib.js'

import ElementPlus from 'element-plus'

createApp(App)
  .use(ElementPlus)
  .use(Dia)
  .mount('#app');