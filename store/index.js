import moment from 'moment'
import _ from 'lodash'
import config from '~/client_config.js'

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
                  dispatch('login', {
                    token: res.data.token,
                    data: res.data.user
                  })
                  // commit("setUser", {
                  //   token: res.data.token,
                  //   data: res.data.user
                  // });
                  // if (res.data.user.type === 0) {
                  //   dispatch("checkUserEmail");
                  // }
                } else {
                  // localStorage.removeItem("user")
                  // commit('setUser', null)
                  dispatch('logout')
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

  async checkUserEmail({
    state,
    commit
  }) {
    let user = _.cloneDeep(state.user)
    const userData = user.data
    if (userData.type === 0) {
      if (userData.email === null) {
        user.data['is_verify_email'] = 0
        commit('showMsgs/resetData')
        commit('showMsgs/setMsgData', {
          title: "Add Your Email!",
          message: "Please add your e-mail to verify your account and more secure."
        })
        commit('showMsgs/setMsgAct', true)
      } else {
        user.data['is_verify_email'] = 0
        await this.$axios.get("/api/startup/email-info").then(res => {
          if (res.data.status && (res.data.email_v_sts === 0 || res.data.email_v_sts === 1)) {
            if (res.data.email_v_sts === 0 && res.data.last_email === false) {
              commit('showMsgs/resetData')
              commit('showMsgs/setMsgData', {
                title: "Verify Your Email!",
                message: 'Please verify your e-mail.',
                action: {
                  txt: 'Send E-mail',
                  param: 'send-verify-email'
                }
              })
              commit('showMsgs/setMsgAct', true)
            }
            if (res.data.email_v_sts === 1) {
              user.data['is_verify_email'] = 1
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
      commit('setUser', user)
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
    // dispatch('socket_io/user_login_emit', payload.token)
    if (payload.data.type === 0) {
      dispatch("checkUserEmail");
    }
  },

  logout({
    commit,
    state,
    dispatch
  }) {
    // dispatch('socket_io/user_logout_emit', state.user.token)
    localStorage.removeItem("user")
    commit('crzb-module/resetData')
    commit('pincode/resetData')
    commit('showMsgs/resetData')
    commit('initAuthSet', false)
    commit('setUser', null)
    commit('hasTermsLoadedSet', false)
  }
}

export const strict = config.dev ? false : true