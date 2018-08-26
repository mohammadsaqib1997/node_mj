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
    async loadTransactions({ commit, rootState }) {
        let result = await this.$axios.$get('/api/transaction/'+rootState.user.data.user_id)
        commit("setList", (result.data ? result.data:[]))
    }
}