export const state = () => ({
    list: []
})

export const mutations = {
    setList: (state, payload) => {
        state.list = payload
    }
}

export const actions = {
    async loadCommissions({ commit, rootState }) {
        let result = await this.$axios.$get('/api/commission/'+rootState.user.data.user_id)
        commit("setList", (result.data ? result.data:[]))
    }
}