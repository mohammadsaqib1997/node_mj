import _ from 'lodash'

const authRoutes = [
    'dashboard',
    'business-chart',
    'notifications',
    'profile',
    'system-level',
    'fund-manager-supreme-finance-total-paid-commission',
    'fund-manager-supreme-finance-total-unpaid-commission',
    'fund-manager-commission-paid',
    'fund-manager-commission-unpaid',
    'members-area-total-members-active-members-report',
    'members-area-total-members-inactive-members-report',
    'members-area-add-new-member',
    'members-area-members-profile',
    'moderators-add-new-moderator',
    'moderators-moderators-profile',
]

const unAuthRoutes = [
    'signup'
]

const visible = [
    'index',
    'products',
    // 'product-details',
    'about-us',
    'contact',
    'coming-soon',
    'career'
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
            } else {
                if (_.indexOf(visible, to.name) < 0) {
                    app.router.push('/coming-soon')
                } else {
                    app.store.commit('pageLoadingSet', false)
                }
            }
        } else {
            if (_.indexOf(unAuthRoutes, to.name) > -1) {
                app.router.push('/dashboard')
            } else {
                if (_.indexOf(authRoutes, to.name) > -1) {
                    app.store.commit('pageLoadingSet', false)
                } else {
                    if (_.indexOf(visible, to.name) < 0) {
                        app.router.push('/coming-soon')
                    } else {
                        app.store.commit('pageLoadingSet', false)
                    }
                }
            }
        }
    })

}