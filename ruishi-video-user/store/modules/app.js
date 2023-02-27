const state = {
	scrollTop: 0
}

const mutations = {
	SET_SCROLLTOP(state, scrollTop)  {
		state.scrollTop = scrollTop
	}
}
 
const actions = {

}

export default {
	namespace: true,
	state,
	mutations,
	actions
}
