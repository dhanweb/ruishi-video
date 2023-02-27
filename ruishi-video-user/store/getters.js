const getters = {
	token: (state) => state.user.token,
	isLogin: (state) => state.user.isLogin,
	user: (state) => state.user.user,
	category: (state) => state.category.category
}

export default getters;