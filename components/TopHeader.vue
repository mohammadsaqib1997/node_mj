<template lang="pug">
    .top-header
        script(id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="560ee249-27e9-4c7e-aba3-46dcedf5de68" type="text/javascript" async)
        .container
            nav.navbar.is-transparent
                .navbar-menu.is-active
                    .navbar-start
                        a.navbar-item(href='#')
                            b-icon.flip-y(icon="phone" size="is-small")
                            span.fs-14 &nbsp;+92 213 4835 054
                        .navbar-item.px-0.hidden-tablet
                            span.sm-line
                        a.navbar-item(href='#')
                            b-icon(icon="envelope" size="is-small")
                            span.fs-14 &nbsp;&nbsp;info@mj-supreme.com

                    .navbar-end
                        .navbar-item
                            ul.social_icons
                                li.sc_icon
                                    a(href="https://www.facebook.com/mjsupremepk" target="_blank")
                                        b-icon(icon="facebook-f" size="is-small" pack="fab")
                                // li.sc_icon
                                //     a
                                //         b-icon(icon="twitter" size="is-small" pack="fab")
                                li.sc_icon
                                    a(href="https://plus.google.com/u/1/117264538400098931844" target="_blank")
                                        b-icon(icon="google-plus-g" size="is-small" pack="fab")
                        .navbar-item.has-dropdown.is-hoverable.p-0.profile_con_nav
                            .navbar-item
                                b-icon(icon="user" size="is-small" pack="far")
                            .navbar-dropdown
                                template(v-if="$store.state.user !== null")
                                    nuxt-link.navbar-item(to="/dashboard") DAHSBOARD
                                    a.navbar-item(@click.prevent="$store.dispatch('logout')") LOGOUT
                                template(v-else)
                                    a.navbar-item(@click.prevent="$store.commit('loginModalActiveSet', true)") LOGIN
                                    nuxt-link.navbar-item(to="/signup") SIGNUP
</template>

<script>
export default {};
</script>

<style lang="sass" scoped src="~/assets/sass/web_top_header.sass">
    
</style>
