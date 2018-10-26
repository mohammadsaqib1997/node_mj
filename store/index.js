import moment from 'moment'

export const state = () => ({
  pageLoading: true,
  initAuth: false,
  loginModalActive: false,
  jwtToken: null,
  user: null,
  isForgotPassword: false,
  hasTermsLoaded: false
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
  },
  hasTermsLoadedSet(state, pld) {
    state.hasTermsLoaded = pld
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
  async initAuthCheck({
    commit,
    dispatch
  }) {
    return new Promise(async resolve => {
      if (localStorage.getItem("user") !== "") {
        try {
          if (JSON.parse(localStorage.getItem('user')).hasOwnProperty("token")) {
            await setTimeout(async () => {
              await this.$axios.post(
                "/api/web/tokenLogin", {
                  token: JSON.parse(localStorage.getItem('user')).token
                }
              ).then(res => {
                if (res.data.status) {
                  commit("setUser", {
                    token: res.data.token,
                    data: res.data.user
                  });
                  if (res.data.user.is_paid && res.data.user.is_paid === 1) {
                    dispatch("checkUserEmail");
                  }
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

  checkUserEmail({
    state,
    commit
  }) {
    const userData = state.user.data
    if (userData.type === 0) {
      if (userData.email === null) {
        commit('showMsgs/resetData')
        commit('showMsgs/setMsgData', {
          title: "Add Your Email!",
          message: "Please add your e-mail to verify your account and more secure."
        })
        commit('showMsgs/setMsgAct', true)
      } else {
        this.$axios.get("/api/startup/email-info").then(res => {
          if (res.data.status && (res.data.email_v_sts === 0 || res.data.email_v_sts === 1)) {
            if (res.data.email_v_sts === 0 && res.data.last_email === false) {
              commit('showMsgs/resetData')
              commit('showMsgs/setMsgData', {
                title: "Varify Your Email!",
                message: 'Please verify your e-mail.',
                action: {
                  txt: 'Send E-mail',
                  param: 'send-verify-email'
                }
              })
              commit('showMsgs/setMsgAct', true)
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },

  login({
    commit,
    dispatch
  }, payload) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        token: payload.token
      })
    );
    commit('setUser', payload)
    if (payload.data.is_paid && payload.data.is_paid === 1) {
      dispatch("checkUserEmail");
    }
  },

  logout({
    commit
  }) {
    localStorage.removeItem("user")
    commit('showMsgs/resetData')
    commit('initAuthSet', false)
    commit('setUser', null)
    commit('hasTermsLoadedSet', false)
  }
}

//export const strict = false