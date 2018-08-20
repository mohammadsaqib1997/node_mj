<template lang="pug">
  .wrapper
    member-dashboard(v-if="u_type === 0")
    admin-dashboard(v-else)
</template>

<script>
import adminDashboard from "~/components/admin_panel/admin/dashboard.vue";
import memberDashboard from "~/components/admin_panel/member/dashboard.vue";
export default {
  layout: "admin_layout",
  components: {
    adminDashboard,
    memberDashboard
  },
  computed: {
    u_type: function() {
      return this.$store.state.user.data.type;
    }
  }
};
</script>

<style scoped lang="sass" src="~/assets/sass/dashboard.sass"></style>
