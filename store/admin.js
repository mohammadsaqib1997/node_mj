import { Toast } from 'buefy'

export const state = () => ({
  wallet: 0,
  loading: false
})

export const mutations = {
  setWallet: (state, payload) => {
    state.wallet = payload
  },
  setLoader: (state, pld) => {
    state.loading = pld
  }
}

export const actions = {
  async loadWallet({ commit }) {
    let result = await this.$axios.$get('/api/admin/wallet')
    commit("setWallet", (result.wallet ? result.wallet : 0))
  }
}