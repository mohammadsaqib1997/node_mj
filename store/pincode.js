export const state = () => ({
    is_pincode: false,
    is_pin_active: false,
    is_last_pin: false
})

export const mutations = {
    setIsPinCode(state, pld) {
        state.is_pincode = pld
    },
    setIsPinActive(state, pld) {
        state.is_pin_active = pld
    },
    setIsLastPin(state, pld) {
        state.is_last_pin = pld
    },
    resetData(state) {
        state.is_pincode = false
        state.is_pin_active = false
        state.is_last_pin = false
    }
}

export const actions = {
    async loadPin({
        commit
    }) {
        await this.$axios
            .get("/api/profile/is_pin/")
            .then(res => {
                commit('setIsPinCode', res.data.is_pin)
                commit('setIsPinActive', res.data.is_pin_act)
                commit('setIsLastPin', res.data.last_pin)
            })
            .catch(err => {
                console.log(err);
            });
    }
}