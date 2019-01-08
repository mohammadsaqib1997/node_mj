export const state = () => ({
  /*
    type
      5 - admin
      0 - country head
      1 - region head
      2 - zonal head
      3 - branch head
  */
  type: null,
  hod_mem_id: null,
  hod_id: null,
  init: false,
})

export const mutations = {
  setBasicInfo: (state, payload) => {
    if (payload) {
      state.type = payload.type
      state.hod_mem_id = payload.hod_mem_id
      state.hod_id = payload.hod_id
    }
  },
  resetData: (state) => {
    state.type = null
    state.hod_mem_id = null
    state.hod_id = null
    state.init = false
  },
  setInit: (state, pld) => {
    state.init = pld
  }
}

export const actions = {
  async loadHeadInfo({
    commit
  }) {
    let result = await this.$axios.$get('/api/assign-role/crzb-head-info')
    commit('setBasicInfo', result ? result : null)
    commit('setInit', true)
    console.log(result)
  }
}