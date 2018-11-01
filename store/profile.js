export const state = () => ({
    name: 'DEFAULT',
    profile: {},
    profile_comp: {
        is_err: false,
        errors: []
    }
})

export const mutations = {
    setProfile: (state, payload) => {
        state.profile = payload
    },
    setName: (state, payload) => {
        state.name = payload
    },
    setProfileComp: (state, payload) => {
        state.profile_comp = payload
    }
}

export const actions = {
    async loadName({ commit }) {
        let result = await this.$axios.$get("/api/profile/name")
        commit("setName", (result.name ? result.name : 'DEFAULT'))
    },
    async loadProfile({ commit, rootState, dispatch }) {
        // await dispatch('loadName')
        let result = await this.$axios.$get('/api/profile/')
        commit("setProfile", (result.data ? result.data : {}))
        commit("setName", (result.data ? result.data.full_name : ''))
    },
    async mayWalletReq({ commit }) {
        await this.$axios
            .get("/api/profile/may_i_wallet_req")
            .then(res => {
                commit('setProfileComp', {
                    is_err: !res.data.status,
                    errors: res.data.errors ? res.data.errors : []
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
}