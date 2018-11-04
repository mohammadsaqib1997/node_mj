import _ from 'lodash'

export default ({
    app,
    store
}) => {
    let int = 0
    setInterval(function () {
        int++
        let str_token = _.get(store.state.user, 'token', null)
        let ls_token = null

        try {
            ls_token = _.get(JSON.parse(localStorage.getItem('user')), 'token', null)
        } catch (error) {
            console.error(error)
        }

        if (str_token !== ls_token) {
            if (ls_token === null) {
                store.dispatch('logout')
            } else {
                store.dispatch('initAuthCheck')
            }
        }

    }, 2000)
}