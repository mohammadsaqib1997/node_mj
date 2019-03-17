export const state = () => ({
  /*
    type
      5 - admin
      0 - country head
      1 - region head / sales coordinator
      2 - zonal head
  */
  type: null,
  hod_mem_id: null,
  hod_id: null,
  role_status: 0,
  init: false,
})

export const mutations = {
  setBasicInfo: (state, payload) => {
    if (payload) {
      state.type = payload.type
      state.hod_mem_id = payload.hod_mem_id
      state.hod_id = payload.hod_id
      state.role_status = payload.role_status
    }
  },
  resetData: (state) => {
    state.type = null
    state.hod_mem_id = null
    state.hod_id = null
    state.role_status = 0
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
    let result = await this.$axios.$get('/api/assign-role/crct-head-info')
    commit('setBasicInfo', result ? result : null)
    commit('setInit', true)
  }
}