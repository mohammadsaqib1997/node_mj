<template lang="pug">
    .admin-layout
        template(v-if="$store.state.pageLoading === false && $store.state.user !== null")
            top-bar
            side-nav
            .main-content
                nuxt
            footer-comp
</template>

<script>
import sideNavComp from "~/components/admin_panel/sidenav.vue";
import topBarComp from "~/components/admin_panel/topbar.vue";
import footerComp from "~/components/admin_panel/footer.vue";
export default {
  components: {
    "side-nav": sideNavComp,
    "top-bar": topBarComp,
    "footer-comp": footerComp
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

<style lang="sass" scoped src="~/assets/sass/admin_layout.sass">
 
</style>
