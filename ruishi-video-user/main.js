import App from './App'
import store from './store'

import Vconsole from 'vconsole'
import {router,RouterMount} from './router'  //路径换成自己的
import 'video.js/dist/video-js.min.css' 

// #ifndef VUE3


import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
// Vue.prototype.$router = router
let vConsole = new Vconsole()
Vue.use(vConsole)
Vue.use(uView)
Vue.use(router)
const app = new Vue({
    ...App
})
app.$mount()


// #endif





// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif