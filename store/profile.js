export const state = () => ({
    name: 'DEFAULT',
    profile: {}
})

export const mutations = {
    setProfile: (state, payload) => {
        state.profile = payload
    },
    setName: (state, payload) => {
        state.name = payload
    }
}

export const actions = {
    async loadName({ commit }) {
        let result = await this.$axios.$get("/api/profile/name")
        commit("setName", (result.name ? result.name : 'DEFAULT'))
    },
    async loadProfile({ commit, rootState, dispatch }) {
        await dispatch('loadName')
        let result = await this.$axios.$get('/api/profile/')
        commit("setProfile", (result.data ? result.data : {}))
    }
}