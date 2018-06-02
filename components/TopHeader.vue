<template lang="pug">
    .top-header
        .container
            nav.navbar.is-transparent
                .navbar-menu.is-active
                    .navbar-start
                        a.navbar-item(href='#')
                            b-icon.flip-y(icon="phone" size="is-small")
                            span.fs-14 &nbsp;+92 331 2286074
                        .navbar-item.px-0
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
                        .navbar-item.p-0
                            button.button.top-button(@click="$store.commit('toggleLoginModal')")
                                b-icon(icon="user" size="is-small" pack="far")
                                span.fs-14 LOGIN

        div


</template>

<script>
    export default {

    }
</script>

<style lang="sass" scoped>
    .top-header
        background-color: #3b3f58
        color: #ffffff

        .navbar-burger
            color: #ffffff
        .navbar-menu
            .navbar-item
                color: #ffffff
                background-color: transparent
                .icon
                    color: #d7bb6e
                .sm-line
                    height: 50%
                    width: 1px
                    background-color: #fff
                .fs-14
                    font-size: 14px
                .top-button
                    background-color: transparent
                    color: #fff
                    border: none
                    height: 100%
                    border-left: 1px solid #535a75
                    border-right: 1px solid #535a75
                    -webkit-box-shadow: none
                    -moz-box-shadow: none
                    box-shadow: none
                    padding-left: 20px
                    padding-right: 20px
                    -webkit-border-radius: 0
                    -moz-border-radius: 0
                    border-radius: 0
            @media screen and (max-width: 1023px)
                background-color: #3b3f58
                text-align: center
                .navbar-item
                    .top-button
                        border: 1px solid #535a75

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