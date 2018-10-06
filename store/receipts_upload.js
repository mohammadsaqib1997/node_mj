import {
    Toast
} from 'buefy'
import Vue from 'vue'

function mimetype_check(file) {
    return (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/rtf" ||
        file.type === "text/plain" ||
        file.type === "image/photoshop" ||
        file.type === "image/x-photoshop" ||
        file.type === "image/psd" ||
        file.type === "application/photoshop" ||
        file.type === "application/psd" ||
        file.type === "zz-application/zz-winassoc-psd"
    )
}

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
    fileChange: ({
        commit
    }, pld) => {
        if (mimetype_check(pld.e[0])) {
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
                message: "Invalid File Selected! Valid types: .pdf, .doc, .docx, .rtf, .txt, .jpeg, .png, .jpg, .psd",
                position: "is-bottom",
                type: "is-danger"
            });
        }
    }
}