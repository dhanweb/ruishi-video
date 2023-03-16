import App from './App'
import store from './store'
import Vconsole from 'vconsole'

// #ifndef VUE3


import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store
let vConsole = new Vconsole()
Vue.use(vConsole)
Vue.use(uView)

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