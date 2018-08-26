<template lang="pug">
    .topbar
        .navbar
            .navbar-brand
                a.navbar-burger.main-menu(role="button" aria-label="menu" aria-expanded="false" v-on:click.prevet="navbarActToggle")
                    span(aria-hidden="true")
                    span(aria-hidden="true")
                    span(aria-hidden="true")
                nuxt-link.navbar-item(to="/")
                    img.brand-logo(src="~/assets/img/admin-logo.png")
                a#nBurgerTop.navbar-burger(role="button" aria-label="menu" aria-expanded="false")
                    span(aria-hidden="true")
                    span(aria-hidden="true")
                    span(aria-hidden="true")
            #navTopMenu.navbar-menu
                .navbar-end
                    .navbar-item.has-dropdown.is-hoverable
                        .navbar-item
                            .count-unread-msg
                                | 6
                            img(src="~/assets/img/notifications-bell-icon.png")
                        .navbar-dropdown
                            nuxt-link.navbar-item(to="/notifications") Notification 1
                            nuxt-link.navbar-item(to="/notifications") Notification 2
                            nuxt-link.navbar-item(to="/notifications") Notification 3
                            nuxt-link.navbar-item(to="/notifications") Notification 4
                            nuxt-link.navbar-item(to="/notifications") Notification 5
                    .navbar-item.has-dropdown.is-hoverable
                        .navbar-item.profile
                            img.profile-ic(src="~/assets/img/profile.png")
                            span.name(:title="$store.state.profile.name") {{ $store.state.profile.name }}
                            img.arrow-ic(src="~/assets/img/arrow.png")
                        .navbar-dropdown
                            nuxt-link.navbar-item(to="/profile") PROFILE
                            a.navbar-item(@click.prevent="$store.dispatch('logout')") LOGOUT
</template>

<script>
export default {
  async mounted() {
      await this.$store.dispatch('profile/loadName')
    $(function() {
      $("body").off("click", "#nBurgerTop");

      $("body").on("click", "#nBurgerTop", function() {
        $(this).toggleClass("is-active");
        $("#navTopMenu").toggleClass("is-active");
      });
    });
  },
  computed: {
    u_type: function() {
      return this.$store.state.user.data.type;
    }
  },
  methods: {
    navbarActToggle: function(e) {
      e.target.closest(".navbar-burger").classList.toggle("is-active");
      document.getElementById("navbar").classList.toggle("is-active");
    }
  }
};
</script>

<style scoped lang="sass">
    .topbar
        border-bottom: 1px solid #ddd
        .navbar-brand
            .navbar-item
                background-color: transparent !important
                .brand-logo
                    height: 3rem
                    max-height: 100%
                    width: auto
            .navbar-burger
              height: auto
              color: #333
              &:nth-child(3)
                  &.is-active
                      span
                          width: 12px
                          &:nth-child(1)
                              left: 50%
                          &:nth-child(3)
                              left: 34%

              &:first-child
                  margin-left: 0
                  margin-right: auto
              &.main-menu
                display: none
              @media screen and (max-width: 1023px)
                &.main-menu
                  display: block

        .navbar-menu
            .navbar-end
                margin-right: 5rem
                .profile
                    .profile-ic
                        margin-right: 1rem
                    .name
                        max-width: 110px
                        text-overflow: ellipsis
                        overflow: hidden
                        display: inline-block
                        white-space: nowrap
                    .arrow-ic
                        margin-left: 3rem
                        -webkit-transform: rotate(90deg)
                        -moz-transform: rotate(90deg)
                        -ms-transform: rotate(90deg)
                        -o-transform: rotate(90deg)
                        transform: rotate(90deg)
                    &:after
                        position: absolute
                        content: ' '
                        height: 5px
                        width: 100%
                        background-color: #d9bd68
                        bottom: -1px
                        left: 0
                .count-unread-msg
                    height: 40px
                    width: 40px
                    background-color: #db3279
                    border-radius: 100%
                    text-align: center
                    line-height: 40px
                    color: #fff
                    font-weight: bold
                    margin-right: -8px
                    z-index: 1
            @media screen and (max-width: 1087px)
                &.is-active
                    top: 100%
                    position: absolute
                    z-index: 6
                    right: 0
                    min-width: 15rem
                .navbar-end
                    margin-right: 0
                    .profile
                        .arrow-ic
                            display: none
                        &:after
                            content: none
                    .navbar-item
                        text-align: center
                        &>.navbar-item
                            align-items: center
                            -webkit-box-align: center
                            -ms-flex-align: center
                            align-items: center
                            display: -webkit-box
                            display: -ms-flexbox
                            display: flex
                        .navbar-dropdown
                            border-bottom: 2px solid #efefef
                            border-top: 2px solid #efefef
                            overflow-y: auto
                            max-height: 10rem
                    .count-unread-msg
                        position: relative

</style>
