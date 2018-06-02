<template lang="pug">
    nav#mainNav.navbar
        .navbar-menu
            nuxt-link.navbar-item.dashboard(to="/dashboard") Dashboard
            nuxt-link.navbar-item.bs-chart(to="/business-chart") Business Chart
            .navbar-item.has-dropdown
                .navbar-item.fn-mang.has-arrow(v-on:click.prevent="dropToggle") Fund Manager
                .navbar-dropdown
                    nuxt-link.navbar-item(to="/fund-manager/commission-unpaid") Commission UnPaid
                    nuxt-link.navbar-item(to="/fund-manager/commission-paid") Commission Paid
                    .navbar-item.has-dropdown
                        .navbar-item.has-arrow(v-on:click.prevent="dropToggle") Supreme Finances
                        .navbar-dropdown
                            nuxt-link.navbar-item(to="/fund-manager/supreme-finance/total-paid-commission") Total Paid Commission
                            nuxt-link.navbar-item(to="/fund-manager/supreme-finance/total-unpaid-commission") Total UnPaid Commission

            .navbar-item.has-dropdown
                .navbar-item.mm-area.has-arrow(v-on:click.prevent="dropToggle") Members Area
                .navbar-dropdown
                    nuxt-link.navbar-item(to="/3") item 1
                    nuxt-link.navbar-item(to="/3") item 1
                    nuxt-link.navbar-item(to="/3") item 1

            .navbar-item.has-dropdown
                .navbar-item.modrtr.has-arrow(v-on:click.prevent="dropToggle") Moderators
                .navbar-dropdown
                    nuxt-link.navbar-item(to="/3") item 1
                    nuxt-link.navbar-item(to="/3") item 1
                    nuxt-link.navbar-item(to="/3") item 1

            nuxt-link.navbar-item.sys-level(to="/system-level") System Level
            nuxt-link.navbar-item.profile(to="/profile") Profile
            nuxt-link.navbar-item.notify(to="/notifications") Notification
</template>

<script>
    export default {
        methods: {
            dropToggle: function (e) {
                $(e.target).parent().toggleClass('is-active')
            }
        }
    }
</script>

<style scoped lang="sass">
    .navbar
        position: absolute
        width: 250px
        height: calc(100% - 100px)
        overflow-y: auto
        border-right: 2px solid #dcdcdc
        background-color: transparent
        .navbar-menu
            display: block
            .navbar-item
                padding: 1rem 2rem 1rem 3.3rem
                color: #afafaf
                text-transform: uppercase
                font-size: 14px
                line-height: 24px
                &:hover
                    background-color: transparent
                    color: #3d3e5a
                &.nuxt-link-exact-active
                    background-color: white
                    box-shadow: 0 0 20px 4px #ddd
                    color: #3d3e5a
                    border-left: 5px solid #dabd67
                &:before
                    content: ' '
                    position: absolute
                    top: 0.8rem
                    left: 1rem
                    background-size: contain
                    background-position: center
                    background-repeat: no-repeat
                    width: 30px
                    height: 30px
                &.has-arrow:after
                    content: ' '
                    position: absolute
                    width: 20px
                    height: 20px
                    right: .6rem
                    background-size: contain
                    background-position: center
                    background-repeat: no-repeat
                    background-image: url("~/assets/img/arrow.png")
                &.has-dropdown
                    padding: 0
                    display: block
                    &:before
                        content: none
                    &>.navbar-item
                        cursor: pointer

                        &.fn-mang
                            &:before
                                background-image: url("~/assets/img/coin.png")
                            &:hover
                                &:before
                                    background-image: url("~/assets/img/coin-active.png")
                        &.mm-area
                            &:before
                                background-image: url("~/assets/img/teamwork.png")
                            &:hover
                                &:before
                                    background-image: url("~/assets/img/teamwork-active.png")
                        &.modrtr
                            &:before
                                background-image: url("~/assets/img/group.png")
                            &:hover
                                &:before
                                    background-image: url("~/assets/img/group-active.png")

                    .navbar-dropdown
                        position: relative
                        border-top: none
                        border-radius: 0
                        display: none
                        .navbar-item
                            font-size: 12px
                            background-color: transparent
                            -webkit-box-shadow: none
                            -moz-box-shadow: none
                            box-shadow: none
                            border-left: 0
                        &>.navbar-item
                            padding-left: 4.2rem
                            padding-right: 0
                            &:before
                                content: none
                            &.has-dropdown
                                padding-left: 0

                    &.is-active
                        &>.navbar-dropdown
                            display: block
                        &>.has-arrow
                            &:after
                                -webkit-transform: rotate(90deg)
                                -moz-transform: rotate(90deg)
                                -ms-transform: rotate(90deg)
                                -o-transform: rotate(90deg)
                                transform: rotate(90deg)
                        &>.navbar-item
                            background-color: white
                            box-shadow: 0 0 20px 4px #ddd
                            color: #3d3e5a
                            border-left: 5px solid #dabd67

                            &.fn-mang
                                &:before
                                    background-image: url("~/assets/img/coin-active.png")
                            &.mm-area
                                &:before
                                    background-image: url("~/assets/img/teamwork-active.png")
                            &.modrtr
                                &:before
                                    background-image: url("~/assets/img/group-active.png")

                &.dashboard
                    &:before
                        background-image: url("~/assets/img/panel.png")
                    &.nuxt-link-exact-active, &:hover
                        &:before
                            background-image: url("~/assets/img/panel-active.png")
                &.bs-chart
                    &:before
                        background-image: url("~/assets/img/graph.png")
                    &.nuxt-link-exact-active, &:hover
                        &:before
                            background-image: url("~/assets/img/graph-active.png")
                &.sys-level
                    &:before
                        background-image: url("~/assets/img/system-level.png")
                    &.nuxt-link-exact-active, &:hover
                        &:before
                            background-image: url("~/assets/img/system-level-active.png")
                &.profile
                    &:before
                        background-image: url("~/assets/img/person.png")
                    &.nuxt-link-exact-active, &:hover
                        &:before
                            background-image: url("~/assets/img/person-active.png")
                &.notify
                    &:before
                        background-image: url("~/assets/img/bell.png")
                    &.nuxt-link-exact-active, &:hover
                        &:before
                            background-image: url("~/assets/img/bell-active.png")
        @media screen and (max-width: 1023px)
            background-color: #ffffff
            margin-left: -250px
            z-index: 1
            -webkit-transition: margin-left 0.3s ease
            -moz-transition: margin-left 0.3s ease
            -ms-transition: margin-left 0.3s ease
            -o-transition: margin-left 0.3s ease
            transition: margin-left 0.3s ease
            &.is-active
                margin-left: 0
            .navbar-menu
                padding: 0
                background-color: transparent
                -webkit-box-shadow: none
                -moz-box-shadow: none
                box-shadow: none


</style>
