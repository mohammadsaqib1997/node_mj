import { Toast } from 'buefy'
import Vue from 'vue'

export const state = () => ({
    sel_file: {}
})

export const mutations = {

    setFile: (state, pld) => {
        Vue.set(state.sel_file, pld.id, pld.e[0])
    },
    remFile: (state, pld) => {
        Vue.delete(state.sel_file, pld)
    },
    resetFile: (state) => {
        state.sel_file = {}
    }

}

export const getters = {
    hasFile: (state) => (id) => {
        return state.sel_file.hasOwnProperty(id)
    }
}

export const actions = {
    fileChange: ({ commit }, pld) => {
        if (pld.e[0].type === "image/png" || pld.e[0].type === "image/jpeg") {
            if (pld.e[0].size <= 5000000) {
                commit('setFile', pld)
            } else {
                Toast.open({
                    duration: 3000,
                    message: "Maximum Upload File Size Is 5MB!",
                    position: "is-bottom",
                    type: "is-danger"
                });
            }
        } else {
            Toast.open({
                duration: 3000,
                message: "Invalid File Selected!",
                position: "is-bottom",
                type: "is-danger"
            });
        }
    }
}