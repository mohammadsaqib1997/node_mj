import _ from 'lodash'

export const state = () => ({
  modalAct: false,
  n_list: [],
  n_list_loader: false,
  total_unread: 0,
  total_s_rows: 1,
  a_item: {},
  load_data: false,
  load_params: {
    limit: 10,
    page: 1,
    search: ""
  }
})

export const mutations = {
  modalActTG: (state, payload) => {
    state.modalAct = payload
    if (payload === false) {
      state.a_item = {}
    }
  },
  set_active_item: (state, payload) => {
    state.a_item = payload
  },
  set_n_list: (state, payload) => {
    state.n_list = payload
  },
  set_loader: (state, payload) => {
    state.load_data = payload
  },
  set_list_loader: (state, payload) => {
    state.n_list_loader = payload
  },
  set_tot_un_read: (state, payload) => {
    state.total_unread = payload
  },
  set_tot_s_rows: (state, pld) => {
    state.total_s_rows = pld
  },
  set_load_params: (state, pld) => {
    _.set(state.load_params, pld.param, pld.value)
  }
}

export const actions = {
  async n_list_load({ commit, state }, payload) {
    await this.$axios
      .get("/api/notification", { params: state.load_params })
      .then(res => {
        if (!res.data.status) {
          // console.log(res.data)
          commit('set_tot_s_rows', res.data.total_rows)
          commit('set_tot_un_read', res.data.un_read)
          commit('set_n_list', res.data.result)
        } else {
          console.log(res.data)
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  async readToggle({ commit, state, dispatch }, hit_id) {
    commit('set_list_loader', true)
    let n_item = _.find(state.n_list, { id: hit_id })
    await this.$axios
      .post('/api/notification/read_it', { id: hit_id, sts: (n_item.read === 1) ? 0 : 1 })
      .then(async res => {
        if (res.data.status === false) {
          console.log(res.data)
        } else {
          await dispatch('n_list_load')
        }
      })
      .catch(err => {
        console.log(err)
      })
    commit('set_list_loader', false)
  },

  async show_notif({ commit, state, dispatch }, open_id) {
    let n_item = _.cloneDeep((_.find(state.n_list, { id: open_id })))
    commit('set_active_item', n_item)
    commit('modalActTG', true)

    commit('set_loader', true)
    if (n_item.read === 0) {
      await this.$axios
        .post('/api/notification/read_it', { id: n_item.id })
        .then(async res => {
          if (res.data.status === false) {
            console.log(res.data)
          } else {
            await dispatch('n_list_load')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    if (n_item.type === 1) {
      await this.$axios
        .get('/api/notification/member_info/' + n_item.from_id)
        .then(res => {
          if (!res.data.status) {
            n_item['data'] = res.data.data
          } else {
            console.log(res.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    } else if (n_item.type === 2) {
      let split_val = (n_item.msg).split('Transaction ID ')
      let trans_id = split_val.length > 1 ? parseInt(split_val[1]) : null
      if (trans_id) {
        await this.$axios
          .get('/api/notification/cm_info/' + trans_id)
          .then(res => {
            if (!res.data.status) {
              n_item['data'] = res.data.data
              n_item['data']['id'] = trans_id
            } else {
              console.log(res.data)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

    commit('set_loader', false)
  }
}