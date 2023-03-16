const state = {
  scrollTop: 0,
  isPC: false
}

const mutations = {
  SET_SCROLLTOP(state, scrollTop) {
    state.scrollTop = scrollTop
  },
  SET_PC_STATUS(state, isPC) {
    console.log('isPC',isPC);
    state.isPC = isPC
  }
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
