import _ from 'lodash'

const after_settle = _.debounce(function (cb) {
  cb()
}, 1000)

export const state = () => ({
  modalAct: false,
  tbar_list: [],
  n_list: [],
  n_list_loader: false,
  total_unread: 0,
  total_s_rows: 1,
  a_item: {},
  load_data: false,
  load_params: {
    limit: 10,
    page: 1,
    search: "",
    filter: "all"
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
  },
  reset_load_params: (state) => {
    state.load_params = {
      limit: 10,
      page: 1,
      search: "",
      filter: "all"
    }
  },
  set_tbar_list: (state, pld) => {
    state.tbar_list = pld
  }
}

export const actions = {
  async load_tbar_list({
    commit
  }) {
    await this.$axios
      .get("/api/notification/top_5")
      .then(res => {
        if (!res.data.status) {
          commit('set_tot_un_read', res.data.un_read)
          commit('set_tbar_list', res.data.result)
        } else {
          console.log(res.data)
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  async n_list_load({
    commit,
    dispatch,
    state
  }) {
    await this.$axios
      .get("/api/notification", {
        params: state.load_params
      })
      .then(async res => {
        if (!res.data.status) {
          if (res.data.result.length === 0 && res.data.total_rows > 0 && state.load_params.page > 1) {
            commit('set_list_loader', true)
            commit('set_load_params', {
              param: 'page',
              value: state.load_params.page - 1
            })
            await dispatch('n_list_load')
            commit('set_list_loader', false)
          } else {
            commit('set_tot_s_rows', res.data.total_rows)
            commit('set_tot_un_read', res.data.un_read)
            commit('set_n_list', res.data.result)
          }

        } else {
          console.log(res.data)
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  async set_params({
    commit,
    state,
    dispatch
  }, pld) {
    let param_val = _.get(state.load_params, pld.param, null)
    if (param_val !== null && param_val !== pld.value) {
      if (pld.param !== 'page') {
        commit('set_load_params', {
          param: 'page',
          value: 1
        })
      }
      commit('set_load_params', pld)
      commit('set_list_loader', true)
      after_settle(async function () {
        await dispatch('n_list_load')
        commit('set_list_loader', false)
      })

    }
  },

  async readToggle({
    commit,
    state,
    dispatch
  }, hit_id) {
    commit('set_list_loader', true)
    let n_item = _.find(state.n_list, {
      id: hit_id
    })
    await this.$axios
      .post('/api/notification/read_it', {
        id: hit_id,
        sts: (n_item.read === 1) ? 0 : 1
      })
      .then(async res => {
        if (res.data.status === false) {
          console.log(res.data)
        } else {
          await dispatch('load_tbar_list')
          await dispatch('n_list_load')
        }
      })
      .catch(err => {
        console.log(err)
      })
    commit('set_list_loader', false)
  },

  async multipleRd({
    commit,
    dispatch
  }, param) {
    commit('set_list_loader', true)
    await this.$axios
      .post('/api/notification/multi_rd', {
        id: param.ids,
        read_sts: param.sts
      })
      .then(async res => {
        if (res.data.status === false) {
          console.log(res.data)
        } else {
          await dispatch('load_tbar_list')
          await dispatch('n_list_load')
        }
      })
      .catch(err => {
        console.log(err)
      })
    commit('set_list_loader', false)
  },

  async remove({
    commit,
    dispatch
  }, id) {
    commit('set_list_loader', true)
    await this.$axios
      .post('/api/notification/user_remove', {
        id
      })
      .then(async res => {
        if (res.data.status === false) {
          console.log(res.data)
        } else {
          await dispatch('load_tbar_list')
          await dispatch('n_list_load')
        }
      })
      .catch(err => {
        console.log(err)
      })
    commit('set_list_loader', false)
  },

  async show_notif({
    commit,
    state,
    dispatch
  }, open_id) {
    let n_pg = true
    let n_item = _.cloneDeep((_.find(state.n_list, {
      id: open_id
    })))
    if (typeof n_item === 'undefined') {
      n_item = _.cloneDeep((_.find(state.tbar_list, {
        id: open_id
      })))
      n_pg = false
    }
    commit('set_active_item', n_item)
    commit('modalActTG', true)

    commit('set_loader', true)
    if (n_item.read === 0) {
      await this.$axios
        .post('/api/notification/read_it', {
          id: n_item.id
        })
        .then(async res => {
          if (res.data.status === false) {
            console.log(res.data)
          } else {
            if (n_pg) {
              await dispatch('load_tbar_list')
              await dispatch('n_list_load')
            } else {
              await dispatch('load_tbar_list')
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
    if (n_item.type === 1) { // new member request to active
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
    } else if (n_item.type === 2) { // withdrawal request from member
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
    } else if (n_item.type === 3) { // self/auto reward level request from member
      await this.$axios
        .get('/api/notification/claim_info/' + n_item.ref_id)
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
    }

    commit('set_loader', false)
  }
}