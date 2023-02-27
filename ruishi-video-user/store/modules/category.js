import { getCateListAPI } from '../../api/category.js'

const state = {
	category: []
}

const mutations = {
	SET_CATEGORY(state, category) {
		state.category = category
	}
}

const actions = {
	async getCateList({commit}) {
		const result = await getCateListAPI()
		commit('SET_CATEGORY', result.data)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
