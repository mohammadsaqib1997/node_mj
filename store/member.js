export const state = () => ({
    wallet: 0,
    load_trans: false
})

export const mutations = {
    setWallet: (state, payload) => {
        state.wallet = payload
    },
    setLoad_trans: (state, payload) => {
        state.load_trans = payload
    }
}

export const actions = {
    async loadWallet({
        commit,
        rootState
    }) {
        let result = await this.$axios.$get('/api/member/wallet/' + rootState.user.data.user_id)
        commit("setWallet", (result.data ? result.data : 0))
    }
}