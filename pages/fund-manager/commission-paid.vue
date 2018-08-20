<template lang="pug">
    .wrapper
        memberCPaid(v-if="u_type === 0")
        adminCPaid(v-else)
</template>

<script>
import adminCPaid from "~/components/admin_panel/admin/fund-manager/commission-paid.vue";
import memberCPaid from "~/components/admin_panel/member/fund-manager/commission-paid.vue";
export default {
  layout: "admin_layout",
  components: {
    adminCPaid,
    memberCPaid
  },
  computed: {
    u_type: function() {
      return this.$store.state.user.data.type;
    }
  }
};
</script>
