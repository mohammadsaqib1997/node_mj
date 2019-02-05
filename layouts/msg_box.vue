<template lang="pug">
  .admin-layout
    template(v-if="$store.state.pageLoading === false && $store.state.user !== null")
      top-bar
      .main-content
        nuxt
      footer-comp
</template>

<script>
import topBarComp from "~/components/admin_panel/topbar.vue";
import footerComp from "~/components/admin_panel/footer.vue";
export default {
  components: {
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

<style lang="scss" scoped>
.admin-layout {
  background-color: #f6f6f6;
  /deep/ {
    .main-content {
      height: calc(100vh - 65px - 35px);
    }
  }
}
</style>
