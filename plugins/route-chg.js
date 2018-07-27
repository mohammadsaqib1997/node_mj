import _ from 'lodash'

const authRoutes = [
    'dashboard'
]

const unAuthRoutes = [
    'signup'
]

export default ({ app }) => {

    app.router.beforeEach((to, from, next) => {
        app.store.commit('pageLoadingSet', true)

        setTimeout(async () => {
            if (app.store.state.initAuth === false) {
                await app.store.dispatch("initAuthCheck")
            }

            next()
        }, 500)
    })

    app.router.afterEach((to, from) => {
        if (app.store.state.user === null) {
            if (_.indexOf(authRoutes, to.name) > -1) {
                app.router.push('/')
            }else{
                app.store.commit('pageLoadingSet', false)
            }
        }else{
            if (_.indexOf(unAuthRoutes, to.name) > -1) {
                app.router.push('/dashboard')
            }else{
                app.store.commit('pageLoadingSet', false)
            }
        }
    })

}