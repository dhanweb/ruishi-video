import {
	loginApi, getUserInfoApi
} from '../../api/user.js'
import {
	getToken,
	setToken,
	removeToken
} from '../../utils/auth.js'
const state = {
	user: {},
	token: getToken(),
	isLogin: false
}

const mutations = {
	SET_USERINFO(state, user) {
		state.user = user
	},
	SET_TOKEN(state, token) {
		state.token = token
		state.isLogin = true
	},
	GET_TOKEN(state) {
		return state.token
	},
	REMOVE_TOKEN(state) {
		state.token = ''
		removeToken()
		state.isLogin = false
	},
}

const actions = {
	async login({ commit }, data) {
		console.log('actions:login')
		const result = await loginApi(data)
		setToken(result.data.token)
		commit('SET_TOKEN', result.data.token)
	},
	async getUserInfo({ commit, state }) { 
		if(!state.isLogin) return false
    console.log('getUserInfo');
		const result = await getUserInfoApi()
		console.log('store.getUserInfo' ,result);
		commit('SET_USERINFO', result.data)
	},
	async logout({commit}) {
		console.log('logout');
		commit('REMOVE_TOKEN')
	}
}

export default {
  namespaced: true,
	state,
	mutations,
	actions,
}
