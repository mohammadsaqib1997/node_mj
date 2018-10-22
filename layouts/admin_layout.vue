<template lang="pug">
  .admin-layout
    template(v-if="$store.state.pageLoading === false && $store.state.user !== null")
      top-bar
      side-nav
      .main-content
        nuxt
      footer-comp
      termAndCondMD(v-if="user.data.type === 0 && $store.state.hasTermsLoaded === false")
      a.whatsapp_link(v-if="user.data.type === 0" href="https://api.whatsapp.com/send?phone=923137877363&text=&source=&data=" target="_blank")
        span.icon
          i.fab.fa-whatsapp
      showMsg
</template>

<script>
import showMsg from "~/components/admin_panel/show-msgs.vue";
import termAndCondMD from "~/components/modals/terms_and_cond.vue";
import sideNavComp from "~/components/admin_panel/sidenav.vue";
import topBarComp from "~/components/admin_panel/topbar.vue";
import footerComp from "~/components/admin_panel/footer.vue";
export default {
  components: {
    "side-nav": sideNavComp,
    "top-bar": topBarComp,
    "footer-comp": footerComp,
    termAndCondMD,
    showMsg
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    }
  },
  watch: {
    user: function(val) {
      if (val === null) {
        this.$router.push("/");
      }
    }
  }
};
</script>

<style lang="scss" scoped src="~/assets/sass/admin_layout.scss">
</style>
