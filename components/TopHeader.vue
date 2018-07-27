<template lang="pug">
    .top-header
        .container
            nav.navbar.is-transparent
                .navbar-menu.is-active
                    .navbar-start
                        a.navbar-item(href='#')
                            b-icon.flip-y(icon="phone" size="is-small")
                            span.fs-14 &nbsp;+92 331 2286074
                        .navbar-item.px-0.hidden-tablet
                            span.sm-line
                        a.navbar-item(href='#')
                            b-icon(icon="envelope" size="is-small")
                            span.fs-14 &nbsp;&nbsp;info@ouac.com

                    .navbar-end
                        .navbar-item
                            ul.social_icons
                                li.sc_icon
                                    a
                                        b-icon(icon="facebook-f" size="is-small" pack="fab")
                                li.sc_icon
                                    a
                                        b-icon(icon="twitter" size="is-small" pack="fab")
                                li.sc_icon
                                    a
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

<style lang="sass" scoped>
    .top-header
      background-color: #3b3f58
      .navbar
        z-index: 31
        .navbar-burger
            color: #ffffff
        .navbar-menu
          .navbar-item
            color: #ffffff
            background-color: transparent
            &.profile_con_nav
              position: relative
              padding-left: 10px
              margin-left: 5px
              &:before
                content: " "
                position: absolute
                top: 1rem
                bottom: 1rem
                left: 0
                width: 1px
                background-color: #fff
              .navbar-dropdown
                .navbar-item
                  color: #333
                  &:hover
                    background-color: whitesmoke !important

            .icon
              color: #d7bb6e
            .sm-line
              height: 50%
              width: 1px
              background-color: #fff
            .fs-14
              font-size: 14px
          @media screen and (max-width: 1087px)
            background-color: #3b3f58
            text-align: center
            .navbar-item
              &.profile_con_nav
                padding-left: 0
                margin-left: 0
                display: inline-block
                &:before
                  content: none
                &>.navbar-item:first-child
                  display: none
                .navbar-dropdown
                  .navbar-item
                    color: #d7bb6e
                    display: inline-block
                    border: 1px solid #d7bb6e
                    margin: 5px
                    &:hover
                      background-color: #38393c !important

    @media screen and (max-width: 1087px)
      .hidden-tablet
        display: none

    .social_icons
        > .sc_icon
            display: inline-block
            a
                color: #d7bb6e
                width: 26px
                text-align: center
                height: 26px
                line-height: 23px
                border: 2px solid #d7bb6e
                margin: 2px
                border-radius: 100%
                display: block
                font-size: 12px

    .px-0
        padding-left: 0
        padding-right: 0
    .p-0
        padding: 0

    .is-transparent
        background-color: transparent

    .flip-y
        -webkit-transform: rotateY(180deg)
        -moz-transform: rotateY(180deg)
        -ms-transform: rotateY(180deg)
        -o-transform: rotateY(180deg)
        transform: rotateY(180deg)

</style>
