<template lang="pug">
    .bg-color
        top-header
        navbar-comp
        nuxt
        footer-comp
        b-modal.login-modal(:active.sync="loginModalActive" :has-modal-card="true" :canCancel="['outside']")
            .modal-card
                section.modal-card-body
                    .logo
                        img(src="~/assets/img/logo-footer.png")
                    .section
                        section.form
                            b-field(label="Username")
                                b-input(type="text" placeholder="(example: Shabir Ahmed)")

                            b-field(label="Password" :addons="false")
                                a.control.fp_link(href="#" @click.prevent="closeLoginModal('/forgot-password')") Forgot ?
                                b-input(type="password" placeholder="******")

                            b-field.has-text-centered.my-2
                                button.button.btn-des-1(@click.prevent="closeLoginModal('/dashboard')") Login

</template>

<script>
    import topHeader from '~/components/TopHeader.vue'
    import navbarComp from '~/components/NavbarComp.vue'
    import footerComp from '~/components/FooterComp.vue'
    export default {
        computed: {
            loginRootActive: function () {
                return this.$store.state.loginModalActive
            }
        },
        components: {
            topHeader,
            navbarComp,
            footerComp
        },
        data () {
            return {
                loginModalActive: this.loginRootActive
            }
        },
        watch: {
            loginRootActive: function (val) {
                this.loginModalActive = val
            },
            loginModalActive: function (val) {
                (!val) ? this.$store.commit('toggleLoginModal') : ''
            }
        },
        methods: {
            closeLoginModal (sendRoute) {
                this.loginModalActive = false
                this.$router.push(sendRoute)
            }
        }
    }
</script>

<style lang="sass">
    .bg-color
        background-color: #f5f6f7
    .login-modal
        .modal-background
            background-color: rgba(10, 10, 10, 0.4)
        .modal-card
            -webkit-border-radius: 5px
            -moz-border-radius: 5px
            border-radius: 5px
            border: 1px solid #d9bd68
            max-width: 450px
            .modal-card-body
                padding: 0
                .logo
                    text-align: center
                    padding: 20px
                    margin-bottom: 1rem
                    border-bottom: 2px solid #ebeced
                    &:after
                        content: ' '
                        display: block
                        width: 50px
                        height: 2px
                        background: #d9bd68
                        position: relative
                        bottom: -22px
                        margin: 0 auto
                .section
                    padding: 1.5rem 4rem 0
    .my-2
        margin-top: 2rem
        margin-bottom: 2rem
    .form
        label.label
            font-weight: 100
        .field
            position: relative
            .fp_link
                position: absolute
                top: 0
                right: 0
                font-size: 14px
                text-decoration: underline
                color: #989898
        .field:not(:last-child)
            margin-bottom: 1.5rem
        input.input
            background-color: #f5f6f7
            -webkit-box-shadow: none
            -moz-box-shadow: none
            box-shadow: none
            -webkit-border-radius: 0
            -moz-border-radius: 0
            border-radius: 0
            border: none
            font-size: 15px
            color: #3b3f57
            padding: 25px 20px

            &:focus, &:active
                border-color: transparent
                -webkit-box-shadow: 0 0 2px 0 #d9bd68
                -moz-box-shadow: 0 0 2px 0 #d9bd68
                box-shadow: 0 0 2px 0 #d9bd68
                background-color: #ffffff
        .control.has-icons-right .icon.is-right
            top: 6px
        .btn-des-1
            color: #ffffff
            background-color: #ea2378
            border-radius: 0
            border: none
            padding: 1rem 2rem
            height: auto
            text-transform: uppercase
            font-weight: bold
            font-size: 14px
            position: relative
            -webkit-box-shadow: 0 2px 20px 2px #ccc
            -moz-box-shadow: 0 2px 20px 2px #ccc
            box-shadow: 0 2px 20px 2px #ccc
            &:hover
                background-color: #c52566
            &:focus
                -webkit-box-shadow: 0 2px 20px 2px #ccc
                -moz-box-shadow: 0 2px 20px 2px #ccc
                box-shadow: 0 2px 20px 2px #ccc
            &:not(.is-loading):after
                content: ' '
                position: absolute
                width: 100%
                height: 5px
                background-color: #c52566
                bottom: 0
</style>