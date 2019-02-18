<template lang="pug">
    .top-header
        .container
            nav.navbar.is-transparent
                .navbar-menu.is-active
                    .navbar-start
                        //- a.navbar-item(href='#')
                        //-     b-icon.flip-y(icon="phone" size="is-small")
                        //-     span.fs-14 &nbsp;+92 213 4835 054
                        .navbar-item
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
                        .navbar-item.px-0.hidden-tablet
                            span.sm-line
                        a.navbar-item(href='#')
                            b-icon(icon="envelope" size="is-small")
                            span.fs-14 &nbsp;&nbsp;info@mj-supreme.com
                        

                    .navbar-end
                        .navbar-item.prm-timer(v-if="timer_act")
                            span.icon
                                img(src="~/assets/img/motorbike_icon.png")
                            span Promotion ends at:
                            span.timer(:class="{'last-mom': timer.hour <= 4}") &nbsp;{{ `${timer.hour} ${timer.hour > 1 ? 'hours':'hour'} ${timer.minute} ${timer.minute > 1 ? 'minutes':'minute'} ${timer.second} ${timer.second > 1 ? 'seconds':'second'}` }}
                        
                        .navbar-item.tot-reg-mem-con
                            span Members Registered -
                            span.act &nbsp;{{ tot_mem }}
                        //- .navbar-item
                        //-     ul.social_icons
                        //-         li.sc_icon
                        //-             a(href="https://www.facebook.com/mjsupremeofficial/" target="_blank")
                        //-                 b-icon(icon="facebook-f" size="is-small" pack="fab")
                        //-         li.sc_icon
                        //-             a(href="https://www.instagram.com/mjsupremeofficial/" target="_blank")
                        //-                 b-icon(icon="instagram" size="is-small" pack="fab")
                        //-         li.sc_icon
                        //-             a(href="https://twitter.com/MjSupreme5?lang=en" target="_blank")
                        //-                 b-icon(icon="twitter" size="is-small" pack="fab")
                        //-         li.sc_icon
                        //-             a(href="https://plus.google.com/b/110755905975639745647/110755905975639745647" target="_blank")
                        //-                 b-icon(icon="google-plus-g" size="is-small" pack="fab")
                        //-         li.sc_icon
                        //-             a(href="https://www.pinterest.com/mjsupremeofficial" target="_blank")
                        //-                 b-icon(icon="pinterest-p" size="is-small" pack="fab")
                        //-         li.sc_icon
                        //-             a(href="https://www.youtube.com/channel/UC0rvk78JHBZ2rPEkgf2iJlg" target="_blank")
                        //-                 b-icon(icon="youtube" size="is-small" pack="fab")
                        //-         li.sc_icon
                        //-             a(href="https://mjsupremeofficial.wixsite.com/home" target="_blank")
                        //-                 b-icon(icon="wix" size="is-small" pack="fab")
                        .navbar-item.has-dropdown.is-hoverable.p-0.profile_con_nav
                            .navbar-item
                                b-icon(icon="user" size="is-small" pack="far")
                            .navbar-dropdown
                                template(v-if="$store.state.user !== null")
                                    //- nuxt-link.navbar-item(v-if="$store.state.user.data.type === 0 && $store.state.user.data.is_paid === 0" to="/user/profile") PROFILE
                                    nuxt-link.navbar-item(to="/dashboard") DAHSBOARD
                                    a.navbar-item(@click.prevent="logoutTr") LOGOUT
                                template(v-else)
                                    a.navbar-item(@click.prevent="$store.commit('loginModalActiveSet', true)") LOGIN
                                    nuxt-link.navbar-item(to="/signup") SIGNUP
</template>

<script>
export default {
  methods: {
    logoutTr() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  },
  mounted() {
    const self = this;
    self.$nextTick(async function() {
      await self.$axios
        .get("/api/web/tot-mem-count")
        .then(res => {
          self.tot_mem = res.data.mems;
        })
        .catch(err => {
          console.log(err);
        });
    });
  },
  computed: {
    timer_act: function() {
      return this.$store.state["timer-counter"]["is_timer"];
    },
    timer: function() {
      return this.$store.state["timer-counter"]["timer"];
    }
  },
  data() {
    return {
      tot_mem: 0
    };
  }
};
</script>

<style lang="scss" scoped src="~/assets/sass/web_top_header.scss">
</style>
