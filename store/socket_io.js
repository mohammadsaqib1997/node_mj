export const state = () => ({
    socket: null,
    connect: false,
    token: null
})

export const mutations = {
    set_socket(state, pld) {
        state.socket = pld
    }
}

export const actions = {
    init({
        commit,
        dispatch
    }, pld) {
        commit('set_socket', pld)
        dispatch('token_listener')

    },
    token_listener({
        state,
        commit
    }, pld) {
        state.socket.on('token', data => {
            if (data.hasOwnProperty("token")) {
                commit("jwtTokenSet", data.token, {
                    root: true
                });
            } else {
                console.error(data.error.message);
            }
        })
    },
    // user_login_emit({
    //     state,
    //     commit
    // }, user_token) {
    //     state.socket.emit('user_login', user_token)
    // },
    // user_logout_emit({
    //     state,
    //     commit
    // }, user_token) {
    //     state.socket.emit('user_logout', user_token)
    // }
}