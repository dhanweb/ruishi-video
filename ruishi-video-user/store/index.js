// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
import user from './modules/user.js'
import category from './modules/category.js'
import getters from './getters.js'


Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	modules: {
		app,
		user,
		category
	},
	getters
})
export default store
