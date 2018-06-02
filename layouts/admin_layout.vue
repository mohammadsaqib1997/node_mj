<template lang="pug">
    .main
        top-bar
        side-nav
        .main-content
            nuxt
        footer-comp
</template>

<script>
    import sideNavComp from '~/components/admin_panel/sidenav.vue'
    import topBarComp from '~/components/admin_panel/topbar.vue'
    import footerComp from '~/components/admin_panel/footer.vue'
    export default {
        components: {
            'side-nav': sideNavComp,
            'top-bar': topBarComp,
            'footer-comp': footerComp
        }
    }
</script>

<style lang="sass">
    .main
        background-color: #f6f6f6
        .wrapper
            padding-bottom: 5rem
        .main-box
            padding: 0
            & > .header
                padding: 1rem 2rem 1rem 2.5rem
                border-bottom: 3px solid #dcdcdc
                position: relative
                align-items: center
                margin-bottom: 0
                h1
                    margin-bottom: 0
                    margin-right: auto
                    font-family: serif
                    font-size: 2rem
                    color: #454545
                    text-transform: uppercase
                .field
                    max-width: 22rem
                    margin-left: auto
                    .control
                        .input
                            border-radius: 0
                            box-shadow: none
                            border: 1px solid #eeeeee
                            height: 2.8rem
                            @media screen and (max-width: 425px)
                                font-size: 3vw
                        .icon
                            top: 4px
                            color: #d9bd68
                        &.is-loading
                            .icon
                                display: none
                            &:after
                                top: 14px
                @media screen and (max-width: 768px)
                    padding: 1rem 2rem
                    h1
                        margin-bottom: .5rem
                    .field
                        max-width: 100%

                &:after
                    content: ' '
                    position: absolute
                    width: 5rem
                    height: 3px
                    background-color: #d9bd68
                    left: 0
                    top: 100%
            .body
                .section
                    position: relative
                    padding: 2rem

        .main-content
            width: calc(100% - 250px)
            height: calc(100vh - 100px)
            position: relative
            margin-left: 250px
            overflow-y: auto
            padding-left: 4rem
            padding-right: 5rem
            padding-top: 2rem
            padding-bottom: 2rem
            margin-bottom: 0
        @media screen and (max-width: 1023px)
            .main-content
                width: 100%
                margin-left: 0
                padding-left: 1rem
                padding-right: 1rem

</style>