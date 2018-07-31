export default function ({ $axios, store, redirect }) {
    $axios.onRequest(config => {
        if(config.url !== "/api/web/tokenLogin") {
            config.headers['x-access-token'] = store.state.jwtToken
            return config
        }
    })
}