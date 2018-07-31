export const state = () => ({
    modalActive: false
})

export const mutations = {
    setModalActive (state, payload) {
        state.modalActive = payload
    }
}