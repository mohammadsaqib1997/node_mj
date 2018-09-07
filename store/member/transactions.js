import _ from 'lodash'

const after_settle = _.debounce(function (cb) {
    cb()
}, 1000)

export const state = () => ({
    list: [],
    list_loader: false,
    tot_balance: 0,
    total_s_rows: 1,
    load_params: {
        limit: 10,
        page: 1,
        search: ""
    }
})

export const mutations = {
    setList: (state, payload) => {
        payload = payload ? payload : []
        state.list = payload
    },
    set_list_loader: (state, bool) => {
        state.list_loader = bool
    },
    set_total_s_rows: (state, num) => {
        state.total_s_rows = num
    },
    set_tot_balance: (state, bal) => {
        state.tot_balance = bal
    },
    set_param: (state, pld) => {
        _.set(state.load_params, pld.param, pld.value)
    },
}

export const actions = {
    async loadTransactions({ commit, state, rootState }) {
        await this.$axios
            .get('/api/transaction/' + rootState.user.data.user_id, { params: state.load_params })
            .then(res => {
                commit('set_tot_balance', res.data.tot_balance)
                commit('set_total_s_rows', res.data.tot_rows)
                commit("setList", res.data.data)
            })
            .catch(err => { console.log(err) })

    },
    async update_params({ commit, state, dispatch }, pld) {
        let param_val = _.get(state.load_params, pld.param, null)
        if (param_val !== null && param_val !== pld.value) {
            if (pld.param !== 'page') {
                commit('set_param', { param: 'page', value: 1 })
            }
            commit('set_param', pld)
            commit('set_list_loader', true)
            after_settle(async function () {
                await dispatch('loadTransactions')
                commit('set_list_loader', false)
            })

        }
    },
}