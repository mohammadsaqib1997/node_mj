<template lang="pug">
  .wrapper
    template(v-if="u_type === 0")
      member-dashboard(v-if="u_paid_sts === 1")
      memberProcess(v-else)
    admin-dashboard(v-else)
    dbPgPromotion(v-if="u_type === 0" :md_act="true")
</template>

<script>
import adminDashboard from "~/components/admin_panel/admin/dashboard.vue";
import memberDashboard from "~/components/admin_panel/member/dashboard.vue";
import memberProcess from "~/components/admin_panel/member/process.vue";
import dbPgPromotion from "~/components/modals/dashboard_pg_promotion.vue";
export default {
  layout: "admin_layout",
  components: {
    adminDashboard,
    memberDashboard,
    memberProcess,
    dbPgPromotion
  },
  computed: {
    u_type: function() {
      return this.$store.state.user.data.type;
    },
    u_paid_sts: function() {
      return this.$store.state.user.data.is_paid;
    }
  }
};
</script>

<style scoped lang="sass" src="~/assets/sass/dashboard.sass"></style>
