import _ from 'lodash'
const authRoutes = [{
        name: "dashboard",
        type_allowed: [0, 1, 2]
    },
    {
        name: "business-chart",
        type_allowed: [0, 1, 2]
    },
    {
        name: "notifications",
        type_allowed: [0, 1, 2]
    },
    {
        name: "user-profile",
        type_allowed: [0, 1, 2]
    },
    {
        name: "user-bank-details",
        type_allowed: [0]
    },
    {
        name: "system-level",
        type_allowed: [0]
    },
    {
        name: "fund-manager-total-finances",
        type_allowed: [1, 2]
    },
    {
        name: "fund-manager-commission-paid",
        type_allowed: [1, 2]
    },
    {
        name: "fund-manager-commission-unpaid",
        type_allowed: [1, 2]
    },
    {
        name: "fund-manager-finance-details",
        type_allowed: [0, 1, 2]
    },
    {
        name: "fund-manager-invoices",
        type_allowed: [0]
    },
    {
        name: "members-area-total-members",
        type_allowed: [1, 2]
    },
    {
        name: "members-area-add-new-member",
        type_allowed: [0, 1, 2]
    },
    {
        name: "members-area-members-profile",
        type_allowed: [1, 2]
    },
    // {
    //     name: "moderators-add-new-moderator",
    //     type_allowed: [2]
    // },
    // {
    //     name: "moderators-moderators-profile",
    //     type_allowed: [2]
    // },
    {
        name: "partners-area-add-new-partner",
        type_allowed: [2]
    },
    {
        name: "partners-area-partners-profile",
        type_allowed: [2]
    },
    {
        name: "system-level-auto-rewards",
        type_allowed: [0]
    },
    // {
    //     name: "system-level-self-rewards",
    //     type_allowed: [0]
    // },
    {
        name: "withdraw",
        type_allowed: [0]
    },
    {
        name: "product",
        type_allowed: [0]
    },
    {
        name: "rewards-rewards-request",
        type_allowed: [1, 2]
    },
    {
        name: "rewards-rewards-completed",
        type_allowed: [1, 2]
    },
    {
        name: "account-vouchers",
        type_allowed: [2]
    },
    {
        name: "company-chart-assign-roles",
        type_allowed: [2]
    },
    {
        name: "company-chart-zone-management",
        type_allowed: [2]
    },
    {
        name: "company-chart-sales-commission",
        type_allowed: [0, 2]
    },
    {
        name: "company-chart-hierarchy",
        type_allowed: [2]
    },
    {
        name: "company-chart-assign-franchise",
        type_allowed: [0]
    },
    {
        name: "company-chart-sales",
        type_allowed: [0]
    },
    // {
    //     name: "campaign-create",
    //     type_allowed: [2]
    // },
    {
        name: "system-level-campaign",
        type_allowed: [0]
    },
    {
        name: "user-nomination",
        type_allowed: [0]
    },
    // {
    //     name: "messages",
    //     type_allowed: [0, 2]
    // }
    {
        name: "lucky-draw",
        type_allowed: [2]
    },
]

const un_paid_routes = [{
        name: 'user-profile'
    },
    {
        name: 'user-bank-details'
    },
    {
        name: 'product'
    },
    {
        name: 'dashboard'
    }
]

const crzbRoutes = [
    'company-chart-sales-commission',
    'company-chart-hierarchy'
]

const franchiseRoutes = [
    'company-chart-sales'
]

const branchRoutes = [
    'company-chart-assign-franchise'
]

const unAuthRoutes = [
    'signup',
    'admin-login'
]

const visible = [
    'index',
    'products',
    // 'product-details',
    'signup',
    'media',
    'about-us',
    'contact',
    'coming-soon',
    'career',
    'admin-login',
    'downloads',
    'partners-and-associates',
    'winners-of-the-month',
    'verify-token-token',
    'unsubscribe-token',
    'terms-and-condition'
]

export default ({
    app,
    error
}) => {

    app.router.beforeEach((to, from, next) => {
        app.store.commit('pageLoadingSet', true)

        setTimeout(async () => {
            if (app.store.state['timer-counter']['initTimerOnce'] === false) {
                await app.store.dispatch("timer-counter/getServerTime")
            }

            if (app.store.state.initAuth === false) {
                await app.store.dispatch("initAuthCheck")
            }

            if (app.store.state['crzb-module']['init'] === false && app.store.state.user) {
                await app.store.dispatch("crzb-module/loadHeadInfo")
            }

            next()
        }, 500)
    })

    app.router.afterEach((to, from) => {

        if (app.store.state.user === null) {
            if (_.find(authRoutes, o => {
                    return o.name === to.name
                })) {
                app.router.push('/')
            } else {
                if (_.indexOf(visible, to.name) < 0) {
                    error({
                        statusCode: 404,
                        message: "Page not found."
                    })
                }
                setTimeout(function () {
                    app.store.commit('pageLoadingSet', false)
                }, 500)
            }
        } else {
            if (_.indexOf(unAuthRoutes, to.name) > -1) {
                app.router.push('/dashboard')
                // if (app.store.state.user.data.type === 0 && app.store.state.user.data.is_paid === 0) {
                //     app.router.push('/user/profile')
                // } else {
                //     app.router.push('/dashboard')
                // }
            } else {
                let findAuthR = _.find(authRoutes, o => {
                    return o.name === to.name
                })
                if (findAuthR) {
                    if (
                        (_.indexOf(findAuthR.type_allowed, app.store.state.user.data.type) < 0) ||
                        (
                            _.indexOf(crzbRoutes, to.name) > -1 &&
                            !app.store.state['crzb-module']['hod_id']
                        ) ||
                        (
                            _.indexOf(franchiseRoutes, to.name) > -1 &&
                            (!app.store.state['crzb-module']['type'] ||
                                app.store.state['crzb-module']['type'] != 4)
                        ) ||
                        (
                            _.indexOf(branchRoutes, to.name) > -1 &&
                            (!app.store.state['crzb-module']['type'] ||
                                app.store.state['crzb-module']['type'] != 3 || app.store.state['crzb-module']['role_status'] === 0)
                        )
                    ) {
                        error({
                            statusCode: 403,
                            message: "Not permission on this page!"
                        })
                        setTimeout(function () {
                            app.store.commit('pageLoadingSet', false)
                        }, 500)
                    } else {
                        if (typeof app.store.state.user.data.is_paid !== 'undefined') {
                            if (app.store.state.user.data.is_paid === 0) {
                                let findUnpaidR = _.find(un_paid_routes, o => {
                                    return o.name === to.name
                                })
                                if (findUnpaidR) {
                                    setTimeout(function () {
                                        app.store.commit('pageLoadingSet', false)
                                    }, 500)
                                } else {
                                    error({
                                        statusCode: 403,
                                        message: "You are un-paid member. Contact administrator to get verify your account."
                                    })
                                    setTimeout(function () {
                                        app.store.commit('pageLoadingSet', false)
                                    }, 500)
                                }

                            } else {
                                setTimeout(function () {
                                    app.store.commit('pageLoadingSet', false)
                                }, 500)
                            }
                        } else {
                            setTimeout(function () {
                                app.store.commit('pageLoadingSet', false)
                            }, 500)
                        }
                    }
                } else {
                    if (_.indexOf(visible, to.name) < 0) {
                        error({
                            statusCode: 404,
                            message: "Page not found."
                        })
                    }
                    setTimeout(function () {
                        app.store.commit('pageLoadingSet', false)
                    }, 500)
                }
            }
        }
    })

}