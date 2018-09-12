import moment from 'moment'

export const state = () => ({
  pageLoading: true,
  initAuth: false,
  loginModalActive: false,
  jwtToken: null,
  user: null,
  isForgotPassword: false
})

export const mutations = {
  pageLoadingSet(state, payload) {
    state.pageLoading = payload
  },
  initAuthSet(state, payload) {
    state.initAuth = payload
  },
  loginModalActiveSet(state, payload) {
    state.loginModalActive = payload
  },
  jwtTokenSet(state, payload) {
    state.jwtToken = payload
  },
  setUser(state, payload) {
    state.user = payload
  },
  isForgotPasswordSet(state, payload) {
    state.isForgotPassword = payload
  }
}

export const getters = {
  formatDate(state) {
    return function (strDate) {
      return moment(new Date(strDate)).format("DD-MM-YYYY")
    }
  },
}

export const actions = {
  // async nuxtServerInit ({ commit, dispatch }, { req, res }) {
  //    console.log(res.locals)
  //    commit('csrfTokenSet', res.locals.csrftoken)
  // },
  async initAuthCheck({ commit }) {
    return new Promise(async resolve => {
      if (localStorage.getItem("user") !== "") {
        try {
          if (JSON.parse(localStorage.getItem('user')).hasOwnProperty("token")) {
            await setTimeout(async () => {
              await this.$axios.post(
                "/api/web/tokenLogin",
                {
                  token: JSON.parse(localStorage.getItem('user')).token
                }
              ).then(res => {
                if (res.data.status) {
                  commit("setUser", { token: res.data.token, data: res.data.user });
                } else {
                  localStorage.removeItem("user")
                  commit('setUser', null)
                }
              })
              commit("initAuthSet", true)
              resolve()
            }, 3000)
          } else {
            commit("initAuthSet", true)
            resolve()
          }
        } catch (err) {
          commit("initAuthSet", true)
          resolve()
        }
      } else {
        commit("initAuthSet", true)
        resolve()
      }
    })
  },

  login({ commit }, payload) {
    localStorage.setItem(
      "user",
      JSON.stringify({ token: payload.token })
    );
    commit('setUser', payload)
  },

  logout({ commit }) {
    localStorage.removeItem("user")
    commit('setUser', null)
  }
}

//export const strict = false
