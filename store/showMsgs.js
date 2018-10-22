import _ from 'lodash'

export const state = () => ({
    msg_act: false,
    msg_data: {
        title: "",
        message: "",
        type: "is-warning",
        force_open: false
    }
})

export const mutations = {
    setMsgAct: (state, val) => {
        state.msg_act = val
    },
    setMsgData: (state, pld) => {
        _.merge(state.msg_data, pld)
    },
    resetData: (state) => {
        state.msg_act = false
        state.msg_data = {
            title: "",
            message: "",
            type: "is-warning",
            force_open: false
        }
    }
}

export const actions = {
    
}