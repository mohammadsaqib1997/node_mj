export const state = () => ({
    list: [],
    balance: 0
})

export const mutations = {
    setList: (state, payload) => {
        let blc = 0
        for (let o of payload) {
            blc += parseInt(o.debit)-parseInt(o.credit)
        }
        state.balance = blc
        state.list = payload
    }
}

export const actions = {
    async loadTransaction({ commit }) {
        let resp = await this.$axios.$get('/api/admin/trans_list')
        commit("setList", (resp.results ? resp.results:[]))
    }
}