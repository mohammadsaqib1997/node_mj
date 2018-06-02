<template lang="pug">
    .footer-comp
        .section
            .container
                .columns
                    .column.is-4
                        .logo-footer
                            img.brand-logo(src="~/assets/img/logo-footer.png")
                        .divider
                        p Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        .divider
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
                    .column
                    .column.is-2
                        h1.title Company
                        ul.footer-links
                            li.item
                                nuxt-link(to="/") About us
                            li.item
                                nuxt-link(to="/") Business Plan
                            li.item
                                nuxt-link(to="/") Supreme Partners & Associates
                            li.item
                                nuxt-link(to="/") Members
                    .column.is-2
                        h1.title Products
                        ul.footer-links
                            li.item
                                nuxt-link(to="/") Discount Products
                            li.item
                                nuxt-link(to="/") Upcoming Products
                    .column.is-2
                        h1.title Useful links
                        ul.footer-links
                            li.item
                                nuxt-link(to="/") Blog
                            li.item
                                nuxt-link(to="/") Career
                            li.item
                                nuxt-link(to="/") Help Center
                            li.item
                                nuxt-link(to="/") Media

                copyrights
</template>

<script>
    import copyrights from '~/components/Copyrights.vue'
    export default {
        components: {
            copyrights
        }
    }
</script>

<style lang="sass" scoped>
    .footer-comp
        background-color: #3b3f58
        color: #8d93ae
        font-size: 14px
        > .section
            padding-bottom: 0
        .divider
            margin-top: 1rem
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
        h1.title
            font-family: serif
            font-size: 1.5rem
            text-transform: uppercase
            color: #8d93ae
            padding-top: 3rem
            padding-bottom: 20px
            position: relative
            &:after
                position: absolute
                content: ' '
                height: 4px
                width: 30px
                background-color: #d9bd68
                bottom: 0
                left: 0
        .footer-links
            .item
                margin-bottom: 0.8rem
                > a
                    color: #8d93ae
                    text-transform: uppercase
</style>
