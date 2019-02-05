<template lang="pug">
    .footer-comp
        .section
            .container
                .columns
                    .column.is-4
                        .logo-footer
                            img.brand-logo(src="~/assets/img/logo-footer.png")
                        .divider
                        p MJ Supreme is a platform to resolve the problems faced by a common man. Our mission is to overcome those drawbacks and provide our services.
                        .divider
                        ul.social_icons
                            li.sc_icon
                                a(href="https://www.facebook.com/mjsupremeofficial/" target="_blank")
                                    b-icon(icon="facebook-f" size="is-small" pack="fab")
                            li.sc_icon
                                a(href="https://www.instagram.com/mjsupremeofficial/" target="_blank")
                                    b-icon(icon="instagram" size="is-small" pack="fab")
                            li.sc_icon
                                a(href="https://twitter.com/MjSupreme5?lang=en" target="_blank")
                                    b-icon(icon="twitter" size="is-small" pack="fab")
                            //- li.sc_icon
                            //-     a(href="https://plus.google.com/b/110755905975639745647/110755905975639745647" target="_blank")
                            //-         b-icon(icon="google-plus-g" size="is-small" pack="fab")
                            li.sc_icon
                                a(href="https://www.pinterest.com/mjsupremeofficial" target="_blank")
                                    b-icon(icon="pinterest-p" size="is-small" pack="fab")
                            li.sc_icon
                                a(href="https://www.youtube.com/channel/UC0rvk78JHBZ2rPEkgf2iJlg" target="_blank")
                                    b-icon(icon="youtube" size="is-small" pack="fab")
                            li.sc_icon
                                a(href="https://mjsupremeofficial.wixsite.com/home" target="_blank")
                                    b-icon(icon="wix" size="is-small" pack="fab")
                    .column
                    .column.is-2
                        h1.title Company
                        ul.footer-links
                            li.item
                                nuxt-link(to="/about-us") About us
                            li.item
                                nuxt-link(to="/about-us") Business Plan
                            li.item
                                nuxt-link(to="/partners-and-associates") Supreme Partners & Associates
                            li.item
                                a(@click.prevent="move_to_member") Members
                    .column.is-2
                        h1.title Products
                        ul.footer-links
                            li.item
                                nuxt-link(to="/products") Discount Products
                            li.item
                                nuxt-link(to="/products") Upcoming Products
                    .column.is-2
                        h1.title Useful links
                        ul.footer-links
                            li.item
                                nuxt-link(to="/coming-soon") Blog
                            li.item
                                nuxt-link(to="/career") Career
                            li.item
                                nuxt-link(to="/coming-soon") Help Center
                            li.item
                                nuxt-link(to="/media") Media

                copyrights
</template>

<script>
import copyrights from "~/components/Copyrights.vue";
export default {
  components: {
    copyrights
  },
  methods: {
    move_to_member() {
      const self = this;
      if (self.$store.state.user !== null) {
          self.$router.push('/dashboard')
      } else {
        self.$store.commit("loginModalActiveSet", true);
      }
    }
  }
};
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
