export const state = () => ({
    loginModalActive: false
})

export const mutations = {
    toggleLoginModal (state) {
        state.loginModalActive = !state.loginModalActive
    }
}

//export const strict = false
