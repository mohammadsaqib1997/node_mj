export const state = () => ({
    wallet: 0
})

export const mutations = {
    setWallet: (state, payload) => {
        state.wallet = payload
    }
}

export const actions = {
    async loadWallet({ commit, rootState }) {
        let result = await this.$axios.$get('/api/member/wallet/'+rootState.user.data.user_id)
        commit("setWallet", (result.data ? result.data:0))
    }
}