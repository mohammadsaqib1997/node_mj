import _ from 'lodash'
const authRoutes = [
    { name: "dashboard", type_allowed: [0, 1, 2] },
    { name: "business-chart", type_allowed: [0, 1, 2] },
    { name: "notifications", type_allowed: [1, 2] },
    { name: "profile", type_allowed: [0, 1, 2] },
    { name: "system-level", type_allowed: [0, 1, 2] },
    { name: "fund-manager-supreme-finance-total-paid-commission", type_allowed: [1, 2] },
    { name: "fund-manager-supreme-finance-total-unpaid-commission", type_allowed: [1, 2] },
    { name: "fund-manager-commission-paid", type_allowed: [1, 2] },
    { name: "fund-manager-commission-unpaid", type_allowed: [1, 2] },
    { name: "fund-manager-bank-details", type_allowed: [0] },
    { name: "fund-manager-finance-details", type_allowed: [0] },
    { name: "members-area-total-members-active-members-report", type_allowed: [1, 2] },
    { name: "members-area-total-members-inactive-members-report", type_allowed: [1, 2] },
    { name: "members-area-add-new-member", type_allowed: [0, 1, 2] },
    { name: "members-area-members-profile", type_allowed: [1, 2] },
    { name: "moderators-add-new-moderator", type_allowed: [2] },
    { name: "moderators-moderators-profile", type_allowed: [2] },
    { name: "withdraw", type_allowed: [0] },
]

const unAuthRoutes = [
    'signup',
    'dev-signup'
]

const visible = [
    'index',
    'products',
    // 'product-details',
    // 'signup',
    'dev-signup',
    'about-us',
    'contact',
    'coming-soon',
    'career'
]

export default ({ app, error }) => {

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
            if (_.find(authRoutes, o => { return o.name === to.name })) {
                app.router.push('/')
            } else {
                if (_.indexOf(visible, to.name) < 0) {
                    app.router.push('/coming-soon')
                } else {
                    setTimeout(function () {
                        app.store.commit('pageLoadingSet', false)
                    }, 500)
                }
            }
        } else {
            if (_.indexOf(unAuthRoutes, to.name) > -1) {
                app.router.push('/dashboard')
            } else {
                let findAuthR = _.find(authRoutes, o => { return o.name === to.name })
                if (findAuthR) {
                    if (_.indexOf(findAuthR.type_allowed, app.store.state.user.data.type) < 0) {
                        error({ statusCode: 403, message: "Not permission on this page!" })
                        setTimeout(function () {
                            app.store.commit('pageLoadingSet', false)
                        }, 500)
                    } else {
                        setTimeout(function () {
                            app.store.commit('pageLoadingSet', false)
                        }, 500)
                    }
                } else {
                    if (_.indexOf(visible, to.name) < 0) {
                        app.router.push('/coming-soon')
                    } else {
                        setTimeout(function () {
                            app.store.commit('pageLoadingSet', false)
                        }, 500)
                    }
                }
            }
        }
    })

}