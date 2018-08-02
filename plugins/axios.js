export default function ({ $axios, store, redirect }) {
    $axios.onRequest(config => {
        if(store.state.user) {
            config.headers['x-access-token'] = store.state.user.token
            return config
        }
        if (config.url !== "/api/web/tokenLogin" && store.state.jwtToken) {
            config.headers['x-access-token'] = store.state.jwtToken
            return config
        }
    })
}